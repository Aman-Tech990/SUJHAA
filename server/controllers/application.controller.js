import Beneficiary from "../models/Beneficiary.js";
import Scheme from "../models/Scheme.js";
import { generateApplicationRefId } from "../utils/generateApplicationRef.js";
import Application from "../models/Application.js";

/* ============================================================
   APPLY FOR A SCHEME
   Route: POST /apply/:schemeId
   ============================================================ */
import { uploadBufferToCloudinary } from "../services/cloudinary.service.js";

export const applyForScheme = async (req, res) => {
    try {
        const { digitalId } = req.user;
        const { schemeId } = req.params;

        // 1. Validate Beneficiary
        const beneficiary = await Beneficiary.findOne({ digitalId });
        if (!beneficiary)
            return res.status(404).json({ success: false, message: "Beneficiary not found" });

        if (!beneficiary.isVerified)
            return res.status(403).json({ success: false, message: "Account not verified" });

        // 2. Validate Scheme
        const scheme = await Scheme.findById(schemeId);
        if (!scheme)
            return res.status(404).json({ success: false, message: "Scheme not found" });

        // 3. Prevent duplicate application
        const already = await Application.findOne({
            beneficiary_id: beneficiary._id,
            scheme_id: schemeId
        });

        if (already)
            return res.status(409).json({ success: false, message: "Already applied for this scheme" });

        // 4. Upload documents
        const requiredDocs = ["domicile", "income", "caste"];
        const uploads = {};

        for (let doc of requiredDocs) {
            if (!req.files[doc] || !req.files[doc][0]) {
                return res.status(400).json({ success: false, message: `${doc} missing` });
            }

            const buffer = req.files[doc][0].buffer;
            const url = await uploadBufferToCloudinary(buffer, "sujhaa/applications");
            uploads[doc] = url;
        }

        // 5. Create unique Application ID
        const applicationId = generateApplicationRefId();

        // 6. Create Application Document
        const newApp = await Application.create({
            application_id: applicationId,
            beneficiary_id: beneficiary._id,
            scheme_id: schemeId,
            uploaded_docs: {
                income_certificate: uploads.income,
                domicile_certificate: uploads.domicile,
                caste_certificate: uploads.caste,
            },
            status: "UNDER_VERIFICATION"
        });

        // 7. Link this Application to Beneficiary
        beneficiary.applications.push(newApp._id);
        await beneficiary.save();

        return res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            application_id: applicationId
        });

    } catch (err) {
        console.error("APPLY ERROR:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};


/* ============================================================
   GET ALL APPLICATIONS OF LOGGED-IN BENEFICIARY
   Route: GET /my-applications
   ============================================================ */
export const getMyApplications = async (req, res) => {
    try {
        const { digitalId } = req.user;

        const beneficiary = await Beneficiary.findOne({ digitalId });

        if (!beneficiary) {
            return res.status(404).json({
                success: false,
                message: "Beneficiary not found"
            });
        }

        // Fetch all applications linked to this beneficiary
        const applications = await Application.find({
            beneficiary_id: beneficiary._id
        })
            .populate("scheme_id")
            .populate("beneficiary_id")
            .populate({
                path: "field_verification_id",
                model: "FieldVerification"
            })
            .populate({
                path: "district_approved_by",
                model: "DistrictOfficer"
            })
            .populate({
                path: "state_approved_by",
                model: "StateOfficer"
            })
            .populate({
                path: "central_approved_by",
                model: "CentralAdmin"
            });

        return res.json({
            success: true,
            applications
        });
    } catch (err) {
        console.error("GET MY APPLICATIONS ERROR:", err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

