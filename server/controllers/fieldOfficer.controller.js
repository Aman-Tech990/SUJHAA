import Application from "../models/Application.js";
import Beneficiary from "../models/Beneficiary.js";
import FieldVerification from "../models/Officer.js";

import { uploadBufferToCloudinary } from "../services/cloudinary.service.js";
import { calculateDistance } from "../utils/calculateDistance.js";

import { compareFaces } from "../utils/faceMatch.js";

/* ============================================================
   1. GET ALL APPLICATIONS OF OFFICER'S DISTRICT
   Route: GET /field-officer/applications
   ============================================================ */
export const getApplicationsForDistrict = async (req, res) => {
    try {
        const officer = req.user;
        const beneficiaries = await Beneficiary.find({ district: officer.district });

        const beneficiaryIds = beneficiaries.map(b => b._id);

        const applications = await Application.find({
            beneficiary_id: { $in: beneficiaryIds },
            status: "PENDING_FIELD_VERIFICATION"
        }).populate("beneficiary_id",
            "name address district phone latitude longitude regPhotoUrl"
        );

        return res.json({
            success: true,
            total: applications.length,
            applications
        });

    } catch (err) {
        console.error("FIELD OFFICER LIST ERROR:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

/* ============================================================
   2. GET SINGLE APPLICATION DETAILS
   Route: GET /field-officer/application/:application_id
   ============================================================ */
export const getSingleApplication = async (req, res) => {
    try {
        const { application_id } = req.params;

        const application = await Application.findOne({ application_id })
            .populate("beneficiary_id",
                "name email phone address district state latitude longitude regPhotoUrl aadhaarUrl casteCertificateUrl incomeCertificateUrl domicileUrl"
            );

        if (!application)
            return res.status(404).json({ success: false, message: "Application not found" });

        return res.json({ success: true, application });

    } catch (err) {
        console.error("SINGLE APPLICATION ERROR:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

/* ============================================================
   FIELD VERIFICATION (GPS + Photo + Face Match)
   Route: POST /field-officer/verify
   ============================================================ */
export const verifyBeneficiary = async (req, res) => {
    try {
        const { application_id, latitude, longitude } = req.body;
        const officer = req.user;

        const beneficiaryPhoto = req.files["beneficiaryPhoto"]?.[0];
        const housePhoto = req.files["housePhoto"]?.[0];

        if (!beneficiaryPhoto || !housePhoto) {
            return res.status(400).json({
                success: false,
                message: "Beneficiary photo & house photo required"
            });
        }

        // Upload to Cloudinary
        const livePhotoUrl = await uploadBufferToCloudinary(
            beneficiaryPhoto.buffer,
            "sujhaa/field_verification"
        );

        const housePhotoUrl = await uploadBufferToCloudinary(
            housePhoto.buffer,
            "sujhaa/field_verification"
        );

        // Find application
        const application = await Application.findOne({ application_id });
        if (!application)
            return res.status(404).json({ success: false, message: "Application not found" });

        // Fetch beneficiary
        const beneficiary = await Beneficiary.findById(application.beneficiary_id);

        // ------------------------------------
        // 1. GPS DISTANCE CHECK
        // ------------------------------------
        const distance = calculateDistance(
            beneficiary.latitude,
            beneficiary.longitude,
            latitude,
            longitude
        );

        const gpsMatch = distance <= 10; // 10 KM radius allowed

        // ------------------------------------
        // 2. FACE MATCH (Face++)
        // ------------------------------------
        const { match: faceMatch, score } = await compareFaces(
            beneficiary.regPhotoUrl,      // registered photo URL
            beneficiaryPhoto.buffer       // officer clicked photo buffer
        );

        // FINAL DECISION
        const finalMatch = gpsMatch && faceMatch;

        // Record verification
        const verificationRecord = await FieldVerification.create({
            application_id,
            officer_id: officer._id,
            officer_role: officer.role,

            beneficiary_photo_url: livePhotoUrl,
            house_photo_url: housePhotoUrl,

            face_match_score: score,
            face_matched: faceMatch,

            officer_latitude: latitude,
            officer_longitude: longitude,
            distance_km: distance,
            gps_matched: gpsMatch,

            verified: finalMatch,
            timestamp: new Date()
        });

        // Update application status
        application.field_verification_id = verificationRecord._id;

        if (finalMatch) {
            application.status = "UNDER_VERIFICATION";
        } else {
            application.status = "REJECTED";
            application.rejection_reason =
                !gpsMatch && !faceMatch
                    ? "GPS + Face mismatch"
                    : !gpsMatch
                        ? "GPS mismatch"
                        : "Face mismatch";

            application.rejected_at = new Date();
            application.rejected_by = officer.role;
        }

        await application.save();

        return res.json({
            success: true,
            message: finalMatch
                ? "Verification SUCCESS"
                : "Verification FAILED",
            faceMatch,
            gpsMatch,
            finalMatch,
            score,
            distance,
            verificationId: verificationRecord._id
        });

    } catch (err) {
        console.error("FIELD VERIFICATION ERROR:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};
