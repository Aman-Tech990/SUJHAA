import Application from "../models/Application.js";
import Beneficiary from "../models/Beneficiary.js";
import FieldVerification from "../models/Officer.js";

import { uploadBufferToCloudinary } from "../services/cloudinary.service.js";
import { calculateDistance } from "../utils/calculateDistance.js";

/* ============================================================
   1. GET ALL APPLICATIONS OF OFFICER'S DISTRICT
   Route: GET /field-officer/applications
   ============================================================ */
export const getApplicationsForDistrict = async (req, res) => {
    try {
        const officer = req.user;
        const officerDistrict = officer.district;

        // beneficiaries in officer district
        const beneficiaries = await Beneficiary.find({ district: officerDistrict });

        const beneficiaryIds = beneficiaries.map(b => b._id);

        // applications pending field verification
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
        return res.status(500).json({
            success: false,
            message: err.message
        });
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

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        return res.json({
            success: true,
            application
        });

    } catch (err) {
        console.error("SINGLE APPLICATION ERROR:", err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


/* ============================================================
   3. FIELD VERIFICATION PROCESS (GPS + Photos)
   Route: POST /field-officer/verify
   ============================================================ */
export const verifyBeneficiary = async (req, res) => {
    try {
        const { application_id, latitude, longitude } = req.body;
        const officer = req.user;

        // files (from RN)
        const beneficiaryPhoto = req.files["beneficiaryPhoto"]?.[0];
        const housePhoto = req.files["housePhoto"]?.[0];

        if (!beneficiaryPhoto || !housePhoto) {
            return res.status(400).json({
                success: false,
                message: "Beneficiary photo & house photo required"
            });
        }

        // Upload to Cloudinary
        const beneficiaryPhotoUrl = await uploadBufferToCloudinary(
            beneficiaryPhoto.buffer,
            "sujhaa/field_verification"
        );

        const housePhotoUrl = await uploadBufferToCloudinary(
            housePhoto.buffer,
            "sujhaa/field_verification"
        );

        // find application
        const application = await Application.findOne({ application_id });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        // fetch beneficiary location
        const beneficiary = await Beneficiary.findById(application.beneficiary_id);

        // calculate GPS distance
        const distance = calculateDistance(
            beneficiary.latitude,
            beneficiary.longitude,
            latitude,
            longitude
        );

        const withinRange = distance <= 5; // 5 km accuracy

        // create verification record
        const verificationRecord = await FieldVerification.create({
            application_id,
            officer_id: officer._id,
            officer_role: officer.role,
            beneficiary_photo_url: beneficiaryPhotoUrl,
            house_photo_url: housePhotoUrl,
            officer_latitude: latitude,
            officer_longitude: longitude,
            distance_km: distance,
            verified: withinRange,
            timestamp: new Date()
        });

        // update application
        application.field_verification_id = verificationRecord._id;
        application.status = withinRange
            ? "UNDER_VERIFICATION"
            : "REJECTED";

        if (!withinRange) {
            application.rejection_reason = "LOCATION MISMATCH";
            application.rejected_by = officer.role;
            application.rejected_at = new Date();
        }

        await application.save();

        return res.json({
            success: true,
            message: withinRange
                ? "Verification Successful"
                : "Location mismatch detected",
            distanceInKM: distance,
            match: withinRange,
            verification_id: verificationRecord._id
        });

    } catch (err) {
        console.error("FIELD VERIFICATION ERROR:", err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
