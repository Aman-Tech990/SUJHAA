import Beneficiary from "../models/Beneficiary.js";
import Application from "../models/Application.js";
import PDFDocument from "pdfkit";
import axios from "axios";
import { generateBarChart, generatePieChart } from "../utils/chartGenerator.js";

export const getStateApplications = async (req, res) => {
    try {
        const state = req.user.state.toLowerCase();

        const apps = await Application.find({
            status: "DISTRICT_APPROVED"
        })
            .populate("scheme_id")
            .populate("beneficiary_id");

        const filtered = apps.filter(
            app =>
                app.beneficiary_id &&
                app.beneficiary_id.state &&
                app.beneficiary_id.state.toLowerCase() === state
        );

        const formatted = filtered.map(app => ({
            applicationRefId: app.application_id,
            name: app.beneficiary_id?.name,
            digitalId: app.beneficiary_id?.digitalId,
            phone: app.beneficiary_id?.phone,
            district: app.beneficiary_id?.district,
            state: app.beneficiary_id?.state,
            schemeName: app.scheme_id?.scheme_name,
            schemeCategory: app.scheme_id?.category,
            appliedAt: app.applied_date
        }));

        return res.json({ success: true, applications: formatted });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

export const getStateApplicationDetails = async (req, res) => {
    try {
        const { refId } = req.params;

        const app = await Application.findOne({ application_id: refId })
            .populate("scheme_id")
            .populate("beneficiary_id");

        if (!app)
            return res.status(404).json({ success: false, message: "Application not found" });

        return res.json({
            success: true,
            beneficiary: app.beneficiary_id,
            application: app
        });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

export const stateApprove = async (req, res) => {
    try {
        const { refId } = req.params;
        const officer = req.user;

        const app = await Application.findOne({ application_id: refId });

        if (!app)
            return res.status(404).json({ success: false, message: "Application not found" });

        if (app.status !== "DISTRICT_APPROVED") {
            return res.status(400).json({
                success: false,
                message: `Cannot approve. Current status: ${app.status}`
            });
        }

        app.status = "STATE_APPROVED";
        app.stateOfficerId = officer.officerId;
        app.stateOfficerComments = req.body.comments || "Approved";

        app.statusHistory.push({
            status: "STATE_APPROVED",
            changedAt: new Date(),
            changedByRole: "STATE_OFFICER",
            changedById: officer._id
        });

        await app.save();

        return res.json({ success: true, message: "State approval successful" });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

export const stateReject = async (req, res) => {
    try {
        const { refId } = req.params;
        const officer = req.user;

        const app = await Application.findOne({ application_id: refId });

        if (!app)
            return res.status(404).json({ success: false, message: "Application not found" });

        if (app.status !== "DISTRICT_APPROVED") {
            return res.status(400).json({
                success: false,
                message: `Cannot reject. Current status: ${app.status}`
            });
        }

        app.status = "STATE_REJECTED";
        app.stateOfficerId = officer.officerId;
        app.stateOfficerComments = req.body.reason || "Rejected";

        app.statusHistory.push({
            status: "STATE_REJECTED",
            changedAt: new Date(),
            changedByRole: "STATE_OFFICER",
            changedById: officer._id
        });

        await app.save();

        return res.json({ success: true, message: "State rejection applied" });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};


const PM_AJAY_LOGO = "https://pmajay.dosje.gov.in/public/latest/images/logo.png";
const INDIA_EMBLEM = "https://i.pinimg.com/736x/91/7e/8b/917e8b082195c4146040977a282e04db.jpg";

export const downloadStateMISPDF = async (req, res) => {
    try {
        const officer = req.user;

        // Fetch PM AJAY images
        const [logoRes, emblemRes] = await Promise.all([
            axios.get(PM_AJAY_LOGO, { responseType: "arraybuffer" }),
            axios.get(INDIA_EMBLEM, { responseType: "arraybuffer" })
        ]);

        const logoBuffer = Buffer.from(logoRes.data, "binary");
        const emblemBuffer = Buffer.from(emblemRes.data, "binary");

        // ----- Fetch Approved Applications -----
        const apps = await Beneficiary.aggregate([
            { $unwind: "$applications" },
            {
                $match: {
                    "applications.status": "APPROVED",
                    state: officer.state
                }
            },
            {
                $project: {
                    digitalId: 1,
                    name: 1,
                    phone: 1,
                    district: 1,
                    schemeName: "$applications.schemeName",
                    schemeCategory: "$applications.schemeCategory",
                    applicationRefId: "$applications.applicationRefId"
                }
            }
        ]);

        // ----- GRAPH DATA -----
        const districtCount = {};
        const categoryCount = {};

        apps.forEach(a => {
            districtCount[a.district] = (districtCount[a.district] || 0) + 1;
            categoryCount[a.schemeCategory] = (categoryCount[a.schemeCategory] || 0) + 1;
        });

        const districtLabels = Object.keys(districtCount);
        const districtValues = Object.values(districtCount);

        const categoryLabels = Object.keys(categoryCount);
        const categoryValues = Object.values(categoryCount);

        // Generate charts
        const barChartImg = generateBarChart(districtLabels, districtValues);
        const pieChartImg = generatePieChart(categoryLabels, categoryValues);

        // ----- PDF START -----
        const doc = new PDFDocument({ margin: 40, size: "A4" });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=state-mis.pdf");

        doc.pipe(res);

        // -------- HEADER --------
        doc.rect(0, 0, doc.page.width, 70).fillColor("#FF9933").fill();
        doc.rect(0, 70, doc.page.width, 10).fillColor("#FFFFFF").fill();
        doc.rect(0, 80, doc.page.width, 10).fillColor("#138808").fill();

        doc.image(logoBuffer, 40, 20, { width: 90 });
        doc.image(emblemBuffer, doc.page.width - 130, 10, { width: 90 });

        doc.moveDown(5);
        doc.fontSize(22).font("Helvetica-Bold")
            .text(`State MIS Report – ${officer.state}`, { align: "center" });

        doc.moveDown(1);

        // -------- SUMMARY --------
        doc.fontSize(14).font("Helvetica-Bold").text("Summary", 40);
        doc.fontSize(12).font("Helvetica")
            .text(`Total Approved Beneficiaries: ${apps.length}`)
            .moveDown(1);

        // -------- GRAPHS --------
        doc.fontSize(14).font("Helvetica-Bold").text("District-wise Beneficiary Count", 40);
        doc.image(barChartImg, { width: 450, align: "center" });
        doc.moveDown(2);

        doc.fontSize(14).font("Helvetica-Bold").text("Scheme Category Distribution", 40);
        doc.image(pieChartImg, { width: 350, align: "center" });
        doc.moveDown(2);

        // -------- TABLE HEADER --------
        doc.fontSize(14).font("Helvetica-Bold").text("Detailed List", 40);
        doc.moveDown(1);

        let y = doc.y;

        doc.fontSize(11).font("Helvetica-Bold");
        doc.text("Digital ID", 40, y);
        doc.text("Name", 150, y);
        doc.text("District", 280, y);
        doc.text("Scheme", 380, y);
        doc.text("Ref ID", 520, y);

        y += 20;
        doc.moveTo(40, y).lineTo(doc.page.width - 40, y).stroke();
        y += 10;

        // -------- ROWS --------
        doc.fontSize(11).font("Helvetica");

        apps.forEach(a => {
            if (y > 720) {
                doc.addPage();
                y = 70;
            }

            doc.text(a.digitalId, 40, y);
            doc.text(a.name, 150, y);
            doc.text(a.district, 280, y);
            doc.text(a.schemeName, 380, y, { width: 120 });
            doc.text(a.applicationRefId, 520, y);

            y += 22;
        });

        // -------- SIGNATURE --------
        doc.moveDown(3);
        doc.text("Signature:", 40);
        doc.text("_______________________", 40);
        doc.font("Helvetica-Bold").text(officer.name);
        doc.font("Helvetica").text("State Officer");

        doc.end();

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
