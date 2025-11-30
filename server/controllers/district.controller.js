import Beneficiary from "../models/Beneficiary.js";
import PDFDocument from "pdfkit";
import axios from "axios";

/* =====================================================
   SCORING SYSTEM
===================================================== */
const generateAIScore = (beneficiary, application) => {
    let score = 40;

    if (application.schemeCategory === "INCOME_GENERATION") score += 20;
    if (application.schemeCategory === "SKILL_DEVELOPMENT") score += 15;
    if (application.schemeCategory === "INFRASTRUCTURE_SUPPORT") score += 10;

    if (beneficiary.incomeCertificateUrl) score += 10;
    if (beneficiary.casteCertificateUrl) score += 10;

    if (application.fieldOfficerVerification?.verified) score += 15;

    score += Math.floor(Math.random() * 6);
    return Math.min(100, Math.max(0, score));
};

/* =====================================================
   DISTRICT — GET ALL APPLICATIONS (FO VERIFIED)
===================================================== */
export const getDistrictApplications = async (req, res) => {
    try {
        const district = req.user.district;

        const beneficiaries = await Beneficiary.find({
            district,
            "applications.status": "UNDER_VERIFICATION",
            "applications.fieldOfficerVerification.verified": true
        });

        const applications = beneficiaries.flatMap((b) =>
            b.applications
                .filter(
                    (a) =>
                        a.status === "UNDER_VERIFICATION" &&
                        a.fieldOfficerVerification?.verified
                )
                .map((app) => ({
                    digitalId: b.digitalId,
                    beneficiaryName: b.name,
                    phone: b.phone,
                    district: b.district,
                    state: b.state,
                    schemeName: app.schemeName,
                    schemeCategory: app.schemeCategory,
                    applicationRefId: app.applicationRefId,
                    aiScore: generateAIScore(b, app),
                    appliedAt: app.appliedAt
                }))
        );

        return res.json({ success: true, applications });
    } catch (err) {
        console.error("DISTRICT_GET_APPLICATIONS:", err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

/* =====================================================
   DISTRICT — APPLICATION DETAILS
===================================================== */
export const getApplicationDetails = async (req, res) => {
    try {
        const { refId } = req.params;

        const beneficiary = await Beneficiary.findOne({
            "applications.applicationRefId": refId
        });

        if (!beneficiary)
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });

        // Cross district protection
        if (beneficiary.district !== req.user.district)
            return res.status(403).json({
                success: false,
                message: "Cannot view applications of another district"
            });

        const app = beneficiary.applications.find(
            (a) => a.applicationRefId === refId
        );

        const aiScore = generateAIScore(beneficiary, app);

        return res.json({
            success: true,
            beneficiary: {
                digitalId: beneficiary.digitalId,
                name: beneficiary.name,
                phone: beneficiary.phone,
                email: beneficiary.email,
                address: beneficiary.address,
                district: beneficiary.district,
                state: beneficiary.state
            },
            application: {
                ...app.toObject(),
                aiScore
            }
        });
    } catch (err) {
        console.error("DISTRICT_APP_DETAILS:", err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

/* =====================================================
   DISTRICT — APPROVE (moves to STATE level)
===================================================== */
export const approveApplication = async (req, res) => {
    try {
        const { refId } = req.params;
        const { comments } = req.body;

        const beneficiary = await Beneficiary.findOne({
            "applications.applicationRefId": refId
        });

        if (!beneficiary)
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });

        if (beneficiary.district !== req.user.district)
            return res.status(403).json({
                success: false,
                message: "District mismatch — cannot approve"
            });

        const app = beneficiary.applications.find(
            (a) => a.applicationRefId === refId
        );

        if (app.status !== "UNDER_VERIFICATION")
            return res.status(400).json({
                success: false,
                message: `Cannot approve application in status: ${app.status}`
            });

        // Proper flow — district approval moves to STATE APPROVAL
        app.status = "DISTRICT_APPROVED";

        app.districtOfficerId = req.user.officerId;
        app.districtOfficerComments = comments || "Approved by District Officer";

        app.statusHistory.push({
            status: "DISTRICT_APPROVED",
            changedAt: new Date(),
            changedByRole: "DISTRICT_OFFICER",
            changedById: req.user.officerId
        });

        await beneficiary.save();

        return res.json({
            success: true,
            message: "Application forwarded to STATE level"
        });
    } catch (err) {
        console.error("DISTRICT_APPROVE:", err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

/* =====================================================
   DISTRICT — REJECT
===================================================== */
export const rejectApplication = async (req, res) => {
    try {
        const { refId } = req.params;
        const { reason } = req.body;

        const beneficiary = await Beneficiary.findOne({
            "applications.applicationRefId": refId
        });

        if (!beneficiary)
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });

        if (beneficiary.district !== req.user.district)
            return res.status(403).json({
                success: false,
                message: "District mismatch — cannot reject"
            });

        const app = beneficiary.applications.find(
            (a) => a.applicationRefId === refId
        );

        if (app.status !== "UNDER_VERIFICATION")
            return res.status(400).json({
                success: false,
                message: `Cannot reject application in status: ${app.status}`
            });

        app.status = "DISTRICT_REJECTED";

        app.districtOfficerId = req.user.officerId;
        app.districtOfficerComments =
            reason || "Rejected by District Officer";

        app.statusHistory.push({
            status: "DISTRICT_REJECTED",
            changedAt: new Date(),
            changedByRole: "DISTRICT_OFFICER",
            changedById: req.user.officerId
        });

        await beneficiary.save();

        return res.json({
            success: true,
            message: "Application rejected"
        });
    } catch (err) {
        console.error("DISTRICT_REJECT:", err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

/* =====================================================
   DISTRICT — PDF DOWNLOAD (DISTRICT_APPROVED ONLY)
===================================================== */
const PM_AJAY_LOGO =
    "https://pmajay.dosje.gov.in/public/latest/images/logo.png";
const INDIA_EMBLEM =
    "https://i.pinimg.com/736x/91/7e/8b/917e8b082195c4146040977a282e04db.jpg";

export const downloadApprovedPDF = async (req, res) => {
    try {
        const officer = req.user;

        // Get images
        const [logoRes, emblemRes] = await Promise.all([
            axios.get(PM_AJAY_LOGO, { responseType: "arraybuffer" }),
            axios.get(INDIA_EMBLEM, { responseType: "arraybuffer" })
        ]);

        const logoBuffer = Buffer.from(logoRes.data);
        const emblemBuffer = Buffer.from(emblemRes.data);

        const approvedApps = await Beneficiary.aggregate([
            { $unwind: "$applications" },
            {
                $match: {
                    "applications.status": "DISTRICT_APPROVED",
                    district: officer.district
                }
            },
            {
                $project: {
                    digitalId: 1,
                    name: 1,
                    phone: 1,
                    district: 1,
                    state: 1,
                    schemeName: "$applications.schemeName",
                    applicationRefId: "$applications.applicationRefId"
                }
            }
        ]);

        const doc = new PDFDocument({ margin: 50, size: "A4" });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=district-approved-beneficiaries.pdf"
        );

        doc.pipe(res);

        /* HEADER */
        doc.image(logoBuffer, 40, 20, { width: 90 });
        doc.image(emblemBuffer, 450, 10, { width: 90 });

        doc.font("Helvetica-Bold").fontSize(20).text(
            "District Approved Beneficiaries Report",
            { align: "center" }
        );

        doc.moveDown().fontSize(14).text(
            `District: ${officer.district} | State: ${officer.state}`,
            { align: "center" }
        );

        doc.moveDown(2);

        /* TABLE */
        let y = 200;
        doc.font("Helvetica-Bold").fontSize(12);
        doc.text("Digital ID", 50, y);
        doc.text("Name", 150, y);
        doc.text("Phone", 280, y);
        doc.text("Scheme", 380, y);
        doc.text("Ref ID", 520, y);

        y += 20;
        doc.moveTo(50, y).lineTo(550, y).stroke();
        y += 15;

        doc.font("Helvetica").fontSize(11);

        approvedApps.forEach((app) => {
            if (y > 750) doc.addPage();

            doc.text(app.digitalId, 50, y);
            doc.text(app.name, 150, y);
            doc.text(app.phone, 280, y);
            doc.text(app.schemeName, 380, y, { width: 120 });
            doc.text(app.applicationRefId, 520, y);

            y += 25;
        });

        doc.end();
    } catch (err) {
        console.error("PDF_GENERATE_ERROR:", err);
        res.status(500).json({
            success: false,
            message: "Could not generate PDF",
            error: err.message
        });
    }
};
