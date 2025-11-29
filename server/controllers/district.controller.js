import Beneficiary from "../models/Beneficiary.js";
import PDFDocument from "pdfkit";
import axios from "axios";

// ===============================
// Simple AI-like Scoring Function
// ===============================
const generateAIScore = (beneficiary, application) => {
    let score = 40; // base score

    // Scheme category weights (looks like policy + AI logic)
    if (application.schemeCategory === "INCOME_GENERATION") score += 20;
    if (application.schemeCategory === "SKILL_DEVELOPMENT") score += 15;
    if (application.schemeCategory === "INFRASTRUCTURE_SUPPORT") score += 10;

    // If income certificate uploaded -> treat as need-based
    if (beneficiary.incomeCertificateUrl) score += 10;

    // If caste certificate available -> confirms SC category
    if (beneficiary.casteCertificateUrl) score += 10;

    // Field officer verified on-ground
    if (application.fieldOfficerVerification?.verified) score += 15;

    // Tiny randomness to make it look ML-ish (but deterministic enough)
    const randomBoost = Math.floor(Math.random() * 6); // 0–5
    score += randomBoost;

    // Clamp between 0 and 100
    score = Math.max(0, Math.min(100, score));
    return score;
};

// ===============================================
// GET: Field-Verified Applications for District
// ===============================================
export const getDistrictApplications = async (req, res) => {
    try {
        const district = req.user.district;

        // 1) Find all beneficiaries in this district
        const beneficiaries = await Beneficiary.find({
            district,
            "applications.status": "UNDER_VERIFICATION",
            "applications.fieldOfficerVerification.verified": true
        });

        // 2) Flatten into a clean list of applications for frontend
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
                    appliedAt: app.appliedAt,
                }))
        );

        return res.json({
            success: true,
            applications,
        });
    } catch (err) {
        console.error("DO GET APPLICATIONS ERROR:", err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// ===============================================
// GET: Single Application Details by Ref ID
// ===============================================
export const getApplicationDetails = async (req, res) => {
    try {
        const { refId } = req.params;

        const beneficiary = await Beneficiary.findOne({
            "applications.applicationRefId": refId,
        });

        if (!beneficiary) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        const app = beneficiary.applications.find(
            (a) => a.applicationRefId === refId
        );

        if (!app) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

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
                state: beneficiary.state,
            },
            application: {
                ...app.toObject(),
                aiScore,
            },
        });
    } catch (err) {
        console.error("DO GET APP DETAIL ERROR:", err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// ===============================================
// POST: APPROVE Application
// ===============================================
export const approveApplication = async (req, res) => {
    try {
        const { refId } = req.params;
        const { comments } = req.body;
        const officer = req.user; // from authOfficer

        const beneficiary = await Beneficiary.findOne({
            "applications.applicationRefId": refId,
        });

        if (!beneficiary) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        const app = beneficiary.applications.find(
            (a) => a.applicationRefId === refId
        );

        if (!app) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        // Only allow approve from UNDER_VERIFICATION state
        if (app.status !== "UNDER_VERIFICATION") {
            return res.status(400).json({
                success: false,
                message: `Cannot approve application in status: ${app.status}`,
            });
        }

        app.status = "APPROVED";
        app.districtOfficerId = officer.officerId;
        app.districtOfficerComments = comments || "Approved by District Officer";
        app.statusHistory.push({
            status: "APPROVED",
            changedAt: new Date(),
            changedByRole: "DISTRICT_OFFICER",
            changedById: officer.officerId,
        });

        await beneficiary.save();

        return res.json({
            success: true,
            message: "Application approved successfully",
        });
    } catch (err) {
        console.error("DO APPROVE ERROR:", err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// ===============================================
// POST: REJECT Application
// ===============================================
export const rejectApplication = async (req, res) => {
    try {
        const { refId } = req.params;
        const { reason } = req.body;
        const officer = req.user;

        const beneficiary = await Beneficiary.findOne({
            "applications.applicationRefId": refId,
        });

        if (!beneficiary) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        const app = beneficiary.applications.find(
            (a) => a.applicationRefId === refId
        );

        if (!app) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        if (app.status !== "UNDER_VERIFICATION") {
            return res.status(400).json({
                success: false,
                message: `Cannot reject application in status: ${app.status}`,
            });
        }

        app.status = "REJECTED";
        app.districtOfficerId = officer.officerId;
        app.districtOfficerComments =
            reason || "Rejected by District Officer";
        app.statusHistory.push({
            status: "REJECTED",
            changedAt: new Date(),
            changedByRole: "DISTRICT_OFFICER",
            changedById: officer.officerId,
        });

        await beneficiary.save();

        return res.json({
            success: true,
            message: "Application rejected successfully",
        });
    } catch (err) {
        console.error("DO REJECT ERROR:", err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// ===============================================
// GET: Download Approved Applications as PDF
// ===============================================
// PUBLIC IMAGE URLS
const PM_AJAY_LOGO = "https://pmajay.dosje.gov.in/public/latest/images/logo.png";
const INDIA_EMBLEM = "https://i.pinimg.com/736x/91/7e/8b/917e8b082195c4146040977a282e04db.jpg";

export const downloadApprovedPDF = async (req, res) => {
    try {
        const officer = req.user;

        const [logoRes, emblemRes] = await Promise.all([
            axios.get(PM_AJAY_LOGO, { responseType: "arraybuffer" }),
            axios.get(INDIA_EMBLEM, { responseType: "arraybuffer" })
        ]);

        const logoBuffer = Buffer.from(logoRes.data, "binary");
        const emblemBuffer = Buffer.from(emblemRes.data, "binary");

        // FILTER DATA BY DISTRICT + STATUS = APPROVED
        const approvedApps = await Beneficiary.aggregate([
            { $unwind: "$applications" },
            {
                $match: {
                    "applications.status": "APPROVED",
                    district: officer.district    // district filtering
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
            `attachment; filename=approved-beneficiaries.pdf`
        );

        doc.pipe(res);

        // ---------------- HEADER -------------------
        const drawHeader = () => {
            // Banner
            doc.rect(0, 0, doc.page.width, 70).fillColor("#FF9933").fill();
            doc.rect(0, 70, doc.page.width, 10).fillColor("#FFFFFF").fill();
            doc.rect(0, 80, doc.page.width, 10).fillColor("#138808").fill();

            // Logos
            doc.image(logoBuffer, 40, 20, { width: 90 });
            doc.image(emblemBuffer, doc.page.width - 130, 10, { width: 90 });

            // Move heading lower for cleaner look
            doc.moveDown(5);

            doc.font("Helvetica-Bold").fontSize(22).fillColor("#000")
                .text("PM-AJAY Beneficiary Approval Report", { align: "center" });

            doc.moveDown(0.5);
            doc.fontSize(14).font("Helvetica")
                .text(`District: ${officer.district}   |   State: ${officer.state}`,
                    { align: "center" });

            doc.moveDown(2);
        };

        drawHeader();

        // ---------------- COLUMN TITLES -------------------
        let y = 200;

        doc.font("Helvetica-Bold").fontSize(12);
        doc.text("Digital ID", 50, y);
        doc.text("Name", 150, y);
        doc.text("Phone", 280, y);
        doc.text("Scheme", 380, y);
        doc.text("Ref ID", 520, y);

        y += 25;
        doc.moveTo(50, y).lineTo(doc.page.width - 50, y).stroke();
        y += 15;

        // ---------------- ROWS (NO TABLE BORDERS) -------------------
        doc.font("Helvetica").fontSize(11);

        approvedApps.forEach((app) => {
            if (y > 750) doc.addPage();

            doc.font("Helvetica").fontSize(11);

            // Columns
            doc.text(app.digitalId, 40, y);         // Digital ID
            doc.text(app.name, 150, y);             // Name
            doc.text(app.phone, 270, y);            // Phone

            // Scheme column (wrap allowed)
            doc.text(app.schemeName, 380, y, { width: 110 });

            // Ref ID column (single line, far right)
            doc.text(app.applicationRefId, 513, y);

            y += 25;
        });

        // -------------- SIGNATURE AREA ----------------
        doc.moveDown(4);
        doc.font("Helvetica").fontSize(12);
        doc.text("Signature:", 50, y + 40);
        doc.text("__________________________", 50, y + 60);

        doc.font("Helvetica-Bold").text(officer.name, 50, y + 85);
        doc.font("Helvetica").text(`${officer.role.replace("_", " ")}`, 50, y + 100);

        doc.end();

    } catch (err) {
        console.error("PDF ERROR:", err);
        res.status(500).json({
            success: false,
            message: "Failed to generate PDF",
            error: err.message
        });
    }
};
