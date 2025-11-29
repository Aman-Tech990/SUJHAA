// -----------------------------------------
// CENTRAL ADMIN ONLY CONTROLLER
// -----------------------------------------
import PDFDocument from "pdfkit";
import axios from "axios";
import { generateBarChart, generatePieChart } from "../utils/chartGenerator.js";
import Beneficiary from "../models/Beneficiary.js";

/**
 * GET ALL STATE APPROVED APPLICATIONS
 */
export const getStateApprovedApplications = async (req, res) => {
    try {
        const list = await Beneficiary.find({
            "applications.status": "STATE_APPROVED"
        });

        return res.status(200).json({
            success: true,
            data: list
        });

    } catch (err) {
        console.error("getStateApprovedApplications:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch state-approved applications"
        });
    }
};



/**
 * CENTRAL FINAL APPROVAL
 */
export const centralFinalApprove = async (req, res) => {
    try {
        const { applicationRefId } = req.body;

        const beneficiary = await Beneficiary.findOne({
            "applications.applicationRefId": applicationRefId
        });

        if (!beneficiary)
            return res.status(404).json({ success: false, message: "Beneficiary not found" });

        const app = beneficiary.applications.find(a => a.applicationRefId === applicationRefId);

        if (app.status !== "STATE_APPROVED") {
            return res.status(400).json({
                success: false,
                message: "Application not eligible for central approval"
            });
        }

        // Update status
        app.status = "CENTRAL_APPROVED";

        app.statusHistory.push({
            status: "CENTRAL_APPROVED",
            changedAt: new Date(),
            changedByRole: "CENTRAL_ADMIN",
            changedById: req.user.officerId
        });

        // Auto create fund installments template
        app.funds = [
            {
                installmentNumber: 1,
                purpose: "Training Assigned",
                amount: 2000,
                status: "PENDING"
            },
            {
                installmentNumber: 2,
                purpose: "50% Training Completed",
                amount: 3000,
                status: "PENDING"
            },
            {
                installmentNumber: 3,
                purpose: "Training Completed",
                amount: 4000,
                status: "PENDING"
            },
            {
                installmentNumber: 4,
                purpose: "Enterprise Kit Distribution",
                amount: 0,
                status: "PENDING"
            }
        ];

        await beneficiary.save();

        return res.status(200).json({
            success: true,
            message: "Central approval successful"
        });

    } catch (err) {
        console.error("centralFinalApprove:", err);
        return res.status(500).json({
            success: false,
            message: "Central approval failed"
        });
    }
};



/**
 * CENTRAL FINAL REJECTION
 */
export const centralFinalReject = async (req, res) => {
    try {
        const { applicationRefId, reason } = req.body;

        const beneficiary = await Beneficiary.findOne({
            "applications.applicationRefId": applicationRefId
        });

        if (!beneficiary)
            return res.status(404).json({ success: false, message: "Beneficiary not found" });

        const app = beneficiary.applications.find(a => a.applicationRefId === applicationRefId);

        // Update status
        app.status = "CENTRAL_REJECTED";

        app.statusHistory.push({
            status: "CENTRAL_REJECTED",
            changedAt: new Date(),
            changedByRole: "CENTRAL_ADMIN",
            changedById: req.user.officerId,
            reason
        });

        await beneficiary.save();

        return res.status(200).json({
            success: true,
            message: "Application rejected successfully"
        });

    } catch (err) {
        console.error("centralFinalReject:", err);
        return res.status(500).json({
            success: false,
            message: "Central rejection failed"
        });
    }
};



/**
 * RELEASE FUND INSTALLMENT
 */
export const releaseInstallment = async (req, res) => {
    try {
        const { applicationRefId, installmentNumber, utrNumber } = req.body;

        const beneficiary = await Beneficiary.findOne({
            "applications.applicationRefId": applicationRefId
        });

        if (!beneficiary)
            return res.status(404).json({ success: false, message: "Beneficiary not found" });

        const app = beneficiary.applications.find(a => a.applicationRefId === applicationRefId);

        const installment = app.funds.find(f => f.installmentNumber === installmentNumber);

        if (!installment) {
            return res.status(404).json({
                success: false,
                message: "Installment not found"
            });
        }

        installment.status = "RELEASED";
        installment.releasedAt = new Date();
        installment.utrNumber = utrNumber;

        await beneficiary.save();

        return res.status(200).json({
            success: true,
            message: `Installment ${installmentNumber} released successfully`
        });

    } catch (err) {
        console.error("releaseInstallment:", err);
        return res.status(500).json({
            success: false,
            message: "Fund release failed"
        });
    }
};

/**
 * MARK ENTERPRISE KIT DISTRIBUTED
 */
export const markEnterpriseKitDistributed = async (req, res) => {
    try {
        const { applicationRefId, kitDetails } = req.body;

        const beneficiary = await Beneficiary.findOne({
            "applications.applicationRefId": applicationRefId
        });

        if (!beneficiary)
            return res.status(404).json({ success: false, message: "Beneficiary not found" });

        const app = beneficiary.applications.find(a => a.applicationRefId === applicationRefId);

        app.enterpriseKit = {
            distributed: true,
            kitDetails,
            distributedAt: new Date()
        };

        // Release final installment
        const finalInstallment = app.funds.find(f => f.installmentNumber === 4);

        if (finalInstallment) {
            finalInstallment.status = "RELEASED";
            finalInstallment.releasedAt = new Date();
        }

        await beneficiary.save();

        return res.status(200).json({
            success: true,
            message: "Enterprise kit distribution marked"
        });

    } catch (err) {
        console.error("markEnterpriseKitDistributed:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to update kit distribution"
        });
    }
};



/**
 * CENTRAL MIS DASHBOARD REPORT
 */
export const getCentralMISReport = async (req, res) => {
    try {
        const total = await Beneficiary.countDocuments();
        const centralApproved = await Beneficiary.countDocuments({
            "applications.status": "CENTRAL_APPROVED"
        });
        const trainingCompleted = await Beneficiary.countDocuments({
            "applications.trainingStatus": "COMPLETED"
        });

        return res.status(200).json({
            success: true,
            data: {
                totalApplications: total,
                centralApproved,
                trainingCompleted
            }
        });

    } catch (err) {
        console.error("getCentralMISReport:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to get MIS report"
        });
    }
};


const PM_AJAY_LOGO = "https://pmajay.dosje.gov.in/public/latest/images/logo.png";
const INDIA_EMBLEM = "https://i.pinimg.com/736x/91/7e/8b/917e8b082195c4146040977a282e04db.jpg";

export const downloadCentralMISPDF = async (req, res) => {
    try {
        const officer = req.user; // CENTRAL_ADMIN

        // ---------- FETCH IMAGES ----------
        const [logoRes, emblemRes] = await Promise.all([
            axios.get(PM_AJAY_LOGO, { responseType: "arraybuffer" }),
            axios.get(INDIA_EMBLEM, { responseType: "arraybuffer" })
        ]);

        const logo = Buffer.from(logoRes.data, "binary");
        const emblem = Buffer.from(emblemRes.data, "binary");

        // ---------- FETCH ALL APPLICATIONS ----------
        const apps = await Beneficiary.aggregate([
            { $unwind: "$applications" },
            {
                $project: {
                    digitalId: 1,
                    name: 1,
                    phone: 1,
                    state: 1,
                    district: 1,
                    schemeName: "$applications.schemeName",
                    schemeCategory: "$applications.schemeCategory",
                    status: "$applications.status",
                    trainingStatus: "$applications.trainingStatus",
                    applicationRefId: "$applications.applicationRefId"
                }
            }
        ]);

        // ---------- SUMMARY COUNTS ----------
        const totalApps = apps.length;

        const centralApproved = apps.filter(a => a.status === "CENTRAL_APPROVED").length;
        const trainingAssigned = apps.filter(a => a.status === "TRAINING_ASSIGNED").length;
        const trainingCompleted = apps.filter(a => a.trainingStatus === "COMPLETED").length;

        // ---------- GRAPH DATA ----------
        const stateCount = {};
        const categoryCount = {};

        apps.forEach(a => {
            stateCount[a.state] = (stateCount[a.state] || 0) + 1;
            categoryCount[a.schemeCategory] = (categoryCount[a.schemeCategory] || 0) + 1;
        });

        const stateLabels = Object.keys(stateCount);
        const stateValues = Object.values(stateCount);

        const categoryLabels = Object.keys(categoryCount);
        const categoryValues = Object.values(categoryCount);

        const barChartImg = generateBarChart(stateLabels, stateValues);
        const pieChartImg = generatePieChart(categoryLabels, categoryValues);

        // ---------- PDF GENERATION ----------
        const doc = new PDFDocument({ size: "A4", margin: 40 });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=central-mis.pdf");

        doc.pipe(res);

        // ----- HEADER: TRICOLOUR -----
        doc.rect(0, 0, doc.page.width, 70).fillColor("#FF9933").fill();
        doc.rect(0, 70, doc.page.width, 10).fillColor("#FFFFFF").fill();
        doc.rect(0, 80, doc.page.width, 10).fillColor("#138808").fill();

        doc.image(logo, 40, 20, { width: 90 });
        doc.image(emblem, doc.page.width - 130, 10, { width: 90 });

        doc.moveDown(5);
        doc.fontSize(22).font("Helvetica-Bold")
            .text("PM-AJAY Central MIS Report", { align: "center" });

        doc.moveDown(2);

        // ----- SUMMARY -----
        doc.fontSize(14).font("Helvetica-Bold").text("National Summary", 40);
        doc.fontSize(12).font("Helvetica")
            .text(`Total Applications: ${totalApps}`)
            .text(`Central Approved: ${centralApproved}`)
            .text(`Training Assigned: ${trainingAssigned}`)
            .text(`Training Completed: ${trainingCompleted}`)
            .moveDown(2);

        // ----- STATE-WISE BAR GRAPH -----
        doc.fontSize(14).font("Helvetica-Bold").text("State-wise Application Distribution", 40);
        doc.image(barChartImg, { width: 450, align: "center" });
        doc.moveDown(2);

        // ----- SCHEME CATEGORY PIE CHART -----
        doc.fontSize(14).font("Helvetica-Bold").text("Scheme Category Distribution", 40);
        doc.image(pieChartImg, { width: 350, align: "center" });
        doc.moveDown(2);

        // ----- DETAILED TABLE -----
        doc.fontSize(14).font("Helvetica-Bold").text("Detailed Application List", 40);
        doc.moveDown(1);

        let y = doc.y;
        doc.fontSize(11).font("Helvetica-Bold");
        doc.text("Digital ID", 40, y);
        doc.text("Name", 150, y);
        doc.text("State", 260, y);
        doc.text("District", 330, y);
        doc.text("Scheme", 420, y, { width: 100 });
        doc.text("Ref ID", 520, y);

        y += 20;
        doc.moveTo(40, y).lineTo(doc.page.width - 40, y).stroke();
        y += 10;

        doc.font("Helvetica").fontSize(10);

        apps.forEach(a => {
            if (y > 720) {
                doc.addPage();
                y = 70;
            }

            doc.text(a.digitalId, 40, y);
            doc.text(a.name, 150, y);
            doc.text(a.state, 260, y);
            doc.text(a.district, 330, y);
            doc.text(a.schemeName, 420, y, { width: 100 });
            doc.text(a.applicationRefId, 520, y);

            y += 18;
        });

        // ----- FOOTER SIGNATURE -----
        doc.moveDown(3);
        doc.font("Helvetica-Bold").text("Signature:", 40);
        doc.text("______________________________", 40);
        doc.font("Helvetica-Bold").text(officer.name, 40);
        doc.font("Helvetica").text("Central Admin – PM-AJAY Scheme");

        doc.end();

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};