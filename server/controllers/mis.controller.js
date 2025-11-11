import { Beneficiary } from "../models/beneficiary.model.js";
import { Verification } from "../models/verification.model.js";
import { Feedback } from "../models/feedback.model.js";
import { generateMISPDF } from "../services/pdf.service.js";

// ---------------- JSON MIS (Dashboard) ----------------
export const getMISReport = async (req, res) => {
    const totalBeneficiaries = await Beneficiary.countDocuments();
    const totalVerifications = await Verification.countDocuments();

    const verificationStats = await Verification.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const sentimentStats = await Feedback.aggregate([
        {
            $group: {
                _id: null,
                avgSentiment: { $avg: "$sentimentScore" },
                totalFeedbacks: { $sum: 1 }
            }
        }
    ]);

    res.json({
        beneficiaries: { total: totalBeneficiaries },
        verifications: {
            total: totalVerifications,
            breakdown: verificationStats
        },
        feedback: sentimentStats[0] || { avgSentiment: 0, totalFeedbacks: 0 }
    });
};

// ---------------- PDF MIS (Download) ----------------
export const downloadMISPDF = async (req, res) => {
    const totalBeneficiaries = await Beneficiary.countDocuments();
    const totalVerifications = await Verification.countDocuments();

    const verificationStats = await Verification.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const sentimentStats = await Feedback.aggregate([
        {
            $group: {
                _id: null,
                avgSentiment: { $avg: "$sentimentScore" },
                totalFeedbacks: { $sum: 1 }
            }
        }
    ]);

    const data = {
        beneficiaries: { total: totalBeneficiaries },
        verifications: {
            total: totalVerifications,
            breakdown: verificationStats
        },
        feedback: sentimentStats[0] || { avgSentiment: 0, totalFeedbacks: 0 }
    };

    // Officer info from JWT  
    const officer = {
        name: req.user.name,
        role: req.user.role
    };

    // Generate Premium PDF  
    const pdfPath = await generateMISPDF(data, officer);

    res.download(pdfPath, "MIS-Report.pdf");
};
