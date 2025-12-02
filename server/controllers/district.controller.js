import Application from "../models/Application.js";
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

        // FETCH ALL UNDER_VERIFICATION WITH SCHEME POPULATED
        const apps = await Application.find({
            status: "UNDER_VERIFICATION",
            field_verified: true
        })
            .populate("scheme_id")    // POPULATE SCHEME
            .populate("beneficiary_id"); // OPTIONAL

        if (!apps.length) {
            return res.json({ success: true, applications: [] });
        }

        const enriched = [];

        for (const app of apps) {
            const beneficiary = await Beneficiary.findById(app.beneficiary_id);
            if (!beneficiary) continue;

            // Filter by district
            if (beneficiary.district !== district) continue;

            enriched.push({
                applicationRefId: app.application_id,
                beneficiaryName: beneficiary.name,
                digitalId: beneficiary.digitalId,
                phone: beneficiary.phone,

                // ⭐ POPULATED SCHEME DETAILS
                schemeId: app.scheme_id._id,
                schemeName: app.scheme_id.scheme_name,
                schemeCategory: app.scheme_id.category,
                schemeDescription: app.scheme_id.description,

                status: app.status,
                fieldVerified: app.field_verified,
                appliedAt: app.applied_date
            });
        }

        return res.json({
            success: true,
            applications: enriched
        });

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

        // 1️⃣ Find application by application_id
        const application = await Application.findOne({
            application_id: refId
        }).populate("scheme_id");

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        // 2️⃣ Get beneficiary
        const beneficiary = await Beneficiary.findById(application.beneficiary_id);
        if (!beneficiary) {
            return res.status(404).json({
                success: false,
                message: "Beneficiary not found"
            });
        }

        // 3️⃣ District protection
        if (beneficiary.district !== req.user.district) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized district access"
            });
        }

        // 4️⃣ Convert uploaded_docs (object → array)
        const uploadedDocsObject = application.uploaded_docs || {};

        const uploadedDocsArray = Object.keys(uploadedDocsObject).map(key => ({
            name:
                key === "incomeCertificate"
                    ? "Income Certificate"
                    : key === "casteCertificate"
                        ? "Caste Certificate"
                        : key === "domicileCertificate"
                            ? "Domicile Certificate"
                            : key === "aadhaar"
                                ? "Aadhaar Card"
                                : key, // fallback
            url: uploadedDocsObject[key]
        }));

        // 5️⃣ Final formatted response
        return res.json({
            success: true,
            beneficiary: {
                name: beneficiary.name,
                digitalId: beneficiary.digitalId,
                phone: beneficiary.phone,
                email: beneficiary.email,
                aadhaarNumber: beneficiary.aadhaarNumber,
                category: beneficiary.category,
                address: beneficiary.address,
                district: beneficiary.district,
                state: beneficiary.state,
            },
            application: {
                applicationId: application.application_id,
                schemeName: application.scheme_id?.scheme_name,
                schemeCategory: application.scheme_id?.category,
                schemeDescription: application.scheme_id?.description,
                status: application.status,
                fieldOfficerVerification: application.field_verified,
                documents: uploadedDocsArray,
                appliedAt: application.applied_date,
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

        // 1️⃣ Find Application by application_id
        const application = await Application.findOne({ application_id: refId });

        if (!application)
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });

        // 2️⃣ Find beneficiary
        const beneficiary = await Beneficiary.findById(application.beneficiary_id);

        if (!beneficiary)
            return res.status(404).json({
                success: false,
                message: "Beneficiary not found"
            });

        // 3️⃣ Validate district
        if (beneficiary.district !== req.user.district)
            return res.status(403).json({
                success: false,
                message: "District mismatch — cannot approve"
            });

        // 4️⃣ Check valid state
        if (application.status !== "UNDER_VERIFICATION")
            return res.status(400).json({
                success: false,
                message: `Cannot approve application in status: ${application.status}`
            });

        // 5️⃣ Update
        application.status = "DISTRICT_APPROVED";
        application.districtOfficerId = req.user.officerId;
        application.districtOfficerComments = req.body.comments || "Approved";

        application.statusHistory.push({
            status: "DISTRICT_APPROVED",
            changedAt: new Date(),
            changedByRole: "DISTRICT_OFFICER",
            changedById: req.user._id
        });

        await application.save();

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

        const application = await Application.findOne({ application_id: refId });

        if (!application)
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });

        const beneficiary = await Beneficiary.findById(application.beneficiary_id);

        if (!beneficiary)
            return res.status(404).json({
                success: false,
                message: "Beneficiary not found"
            });

        if (beneficiary.district !== req.user.district)
            return res.status(403).json({
                success: false,
                message: "District mismatch — cannot reject"
            });

        if (application.status !== "UNDER_VERIFICATION")
            return res.status(400).json({
                success: false,
                message: `Cannot reject application in status: ${application.status}`
            });

        application.status = "DISTRICT_REJECTED";
        application.districtOfficerId = req.user.officerId;
        application.districtOfficerComments = req.body.reason || "Rejected";

        application.statusHistory.push({
            status: "DISTRICT_REJECTED",
            changedAt: new Date(),
            changedByRole: "DISTRICT_OFFICER",
            changedById: req.user._id
        });

        await application.save();

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
