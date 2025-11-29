import Beneficiary from "../models/Beneficiary.js";
import Scheme from "../models/Scheme.js";
import { generateApplicationRefId } from "../utils/generateApplicationRef.js";

/* ============================================================
   APPLY FOR A SCHEME
   Route: POST /apply/:schemeId
   ============================================================ */
export const applyForScheme = async (req, res) => {
    try {
        const { digitalId } = req.user;       // from JWT
        const { schemeId } = req.params;      // MongoDB _id of scheme

        if (!schemeId) {
            return res.status(400).json({
                success: false,
                message: "Scheme ID is required"
            });
        }

        // 1. Find Beneficiary
        const beneficiary = await Beneficiary.findOne({ digitalId });
        if (!beneficiary)
            return res.status(404).json({
                success: false,
                message: "Beneficiary not found"
            });

        if (!beneficiary.isVerified)
            return res.status(403).json({
                success: false,
                message: "Your account is not verified"
            });

        // 2. Find Scheme using MONGO _id
        const scheme = await Scheme.findById(schemeId);
        if (!scheme)
            return res.status(404).json({
                success: false,
                message: "Scheme not found"
            });

        if (scheme.status !== "ACTIVE")
            return res.status(400).json({
                success: false,
                message: "Scheme is not active"
            });

        // 3. Prevent duplicate application
        const alreadyApplied = beneficiary.applications.some(
            (app) => app.schemeName === scheme.name
        );

        if (alreadyApplied) {
            return res.status(409).json({
                success: false,
                message: "You have already applied for this scheme"
            });
        }

        // 4. Generate Application Ref ID
        const applicationRefId = generateApplicationRefId();

        // 5. Create Application Object inside Beneficiary
        const newApplication = {
            applicationRefId,
            schemeName: scheme.name,
            schemeCategory: scheme.category,
            appliedAt: new Date(),

            status: "PENDING",

            statusHistory: [
                {
                    status: "PENDING",
                    changedAt: new Date(),
                    changedByRole: "BENEFICIARY",
                    changedById: digitalId
                }
            ]
        };

        // 6. Push to Beneficiary Applications Array
        beneficiary.applications.push(newApplication);
        await beneficiary.save();

        return res.status(201).json({
            success: true,
            message: "Scheme application submitted successfully",
            applicationRefId,
            schemeName: scheme.name,
            schemeCategory: scheme.category
        });

    } catch (err) {
        console.error("APPLY SCHEME ERROR:", err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
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

        if (beneficiary.applications.length === 0) {
            return res.json({ success: true, applications: [] });
        }

        // Format applications for frontend
        const applications = beneficiary.applications.map(app => ({
            applicationRefId: app.applicationRefId,
            schemeName: app.schemeName,
            schemeCategory: app.schemeCategory,
            appliedAt: app.appliedAt,
            status: app.status,

            // Field Officer Verification
            fieldOfficerVerification: {
                verified: app.fieldOfficerVerification?.verified || false,
                officerId: app.fieldOfficerVerification?.officerId || null,
                timestamp: app.fieldOfficerVerification?.timestamp || null
            },

            // District
            districtOfficerStatus: {
                comments: app.districtOfficerComments || null,
                officerId: app.districtOfficerId || null
            },

            // State
            stateOfficerStatus: {
                comments: app.stateOfficerComments || null,
                officerId: app.stateOfficerId || null
            },

            // Training
            training: {
                center: app.trainingCenterAssigned || null,
                startDate: app.trainingStartDate || null,
                endDate: app.trainingEndDate || null,
                progress: app.trainingProgress || 0
            },

            statusHistory: app.statusHistory || []
        }));

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
