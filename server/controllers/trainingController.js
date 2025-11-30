// controllers/trainingController.js

import Beneficiary from "../models/Beneficiary.js";
import Trainer from "../models/Trainer.js";

/* ---------------------------------------------------
   Helper: Recalculate training progress %
--------------------------------------------------- */
function recalcProgress(app) {
    if (!app.totalSessions || app.totalSessions === 0) return 0;
    return Math.min(100, Math.round((app.completedSessions / app.totalSessions) * 100));
}

/* ---------------------------------------------------
   1) DISTRICT: GET ALL CENTRAL APPROVED for Training
--------------------------------------------------- */
export const getCentralApprovedForDistrict = async (req, res) => {
    try {
        const district = req.user?.district; // from district officer JWT

        if (!district) {
            return res.status(400).json({
                success: false,
                message: "District missing in token",
            });
        }

        const list = await Beneficiary.find({
            district,
            "applications.status": "CENTRAL_APPROVED",
        }).select("name district applications");

        const formatted = [];

        list.forEach((b) => {
            b.applications.forEach((app) => {
                if (app.status === "CENTRAL_APPROVED") {
                    formatted.push({
                        beneficiaryName: b.name,
                        beneficiaryId: b._id,
                        applicationRefId: app.applicationRefId,
                        schemeName: app.schemeName,
                        schemeCategory: app.schemeCategory,
                        district: b.district,
                    });
                }
            });
        });

        return res.status(200).json({
            success: true,
            data: formatted,
        });
    } catch (err) {
        console.error("getCentralApprovedForDistrict:", err);
        return res.status(500).json({
            success: false,
            message: "Error fetching applications",
            error: err.message,
        });
    }
};

/* ---------------------------------------------------
   2) DISTRICT: ASSIGN TRAINING
--------------------------------------------------- */
export const assignTrainingToBeneficiary = async (req, res) => {
    try {
        const districtOfficer = req.user;

        const {
            applicationRefId,
            trainerId,
            trainingCenterAssigned,
            trainingSkill,
            totalSessions,
            trainingStartDate,
            trainingEndDate,
        } = req.body;

        if (
            !applicationRefId ||
            !trainerId ||
            !trainingCenterAssigned ||
            !trainingSkill ||
            !totalSessions
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "applicationRefId, trainerId, trainingCenterAssigned, trainingSkill and totalSessions are required",
            });
        }

        // 1. Validate trainer
        const trainer = await Trainer.findOne({ trainerId });
        if (!trainer) {
            return res.status(404).json({
                success: false,
                message: "Trainer not found",
            });
        }

        // 2. Find beneficiary with this application
        const beneficiary = await Beneficiary.findOne({
            "applications.applicationRefId": applicationRefId,
        });

        if (!beneficiary) {
            return res.status(404).json({
                success: false,
                message: "Beneficiary not found",
            });
        }

        // 2A. Ensure district officer is assigning only within own district
        if (
            districtOfficer?.district &&
            beneficiary.district !== districtOfficer.district
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You cannot assign training for a beneficiary from another district",
            });
        }

        // 3. Find the specific application
        const app = beneficiary.applications.find(
            (a) => a.applicationRefId === applicationRefId
        );

        if (!app) {
            return res.status(404).json({
                success: false,
                message: "Application not found inside beneficiary",
            });
        }

        // Only CENTRAL APPROVED can be assigned training
        if (app.status !== "CENTRAL_APPROVED") {
            return res.status(400).json({
                success: false,
                message: "Application is not CENTRAL_APPROVED",
                currentStatus: app.status,
            });
        }

        // 4. Assign training fields
        app.trainerId = trainerId;
        app.trainingSkill = trainingSkill;
        app.trainingCenterAssigned = trainingCenterAssigned;

        app.totalSessions = Number(totalSessions);
        app.completedSessions = 0;

        app.trainingStartDate = trainingStartDate
            ? new Date(trainingStartDate)
            : null;
        app.trainingEndDate = trainingEndDate ? new Date(trainingEndDate) : null;

        app.trainingStatus = "NOT_STARTED";
        app.trainingProgress = 0;

        app.status = "TRAINING_ASSIGNED";

        app.statusHistory.push({
            status: "TRAINING_ASSIGNED",
            changedAt: new Date(),
            changedByRole: "DISTRICT_OFFICER",
            changedById: districtOfficer?.officerId || "DISTRICT",
        });

        await beneficiary.save();

        // 5. Update trainer assigned list (avoid duplicate)
        let trainerApp = trainer.assignedApplications.find(
            (t) => t.applicationRefId === applicationRefId
        );

        if (!trainerApp) {
            trainer.assignedApplications.push({
                applicationRefId,
                beneficiaryName: beneficiary.name,
                skill: trainingSkill,
                trainingStartDate: app.trainingStartDate,
                trainingEndDate: app.trainingEndDate,
                totalSessions: Number(totalSessions),
                completedSessions: 0,
                trainingProgress: 0,
                lastUpdated: new Date(),
            });
        } else {
            trainerApp.skill = trainingSkill;
            trainerApp.trainingStartDate = app.trainingStartDate;
            trainerApp.trainingEndDate = app.trainingEndDate;
            trainerApp.totalSessions = Number(totalSessions);
            trainerApp.completedSessions = 0;
            trainerApp.trainingProgress = 0;
            trainerApp.lastUpdated = new Date();
        }

        await trainer.save();

        return res.status(200).json({
            success: true,
            message: "Training assigned successfully",
        });
    } catch (err) {
        console.error("assignTraining:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to assign training",
            error: err.message,
        });
    }
};

/* ---------------------------------------------------
   3) TRAINER: ADD SESSION
--------------------------------------------------- */
export const addTrainingSession = async (req, res) => {
    try {
        const trainerId = req.user?.trainerId;

        const {
            applicationRefId,
            date,
            topic,
            hours,
            trainerRemarks,
            markAsCompleted,
        } = req.body;

        if (!trainerId || !applicationRefId || !date || !topic) {
            return res.status(400).json({
                success: false,
                message: "trainerId, applicationRefId, date and topic are required",
            });
        }

        // 1. Trainer validation
        const trainer = await Trainer.findOne({ trainerId });
        if (!trainer) {
            return res.status(404).json({
                success: false,
                message: "Trainer not found",
            });
        }

        // 2. Check that the application is assigned to this trainer
        let trainerApp = trainer.assignedApplications.find(
            (t) => t.applicationRefId === applicationRefId
        );

        if (!trainerApp) {
            return res.status(403).json({
                success: false,
                message: "This application is not assigned to this trainer",
            });
        }

        // 3. Sync beneficiary & application
        const beneficiary = await Beneficiary.findOne({
            "applications.applicationRefId": applicationRefId,
        });

        if (!beneficiary) {
            return res.status(404).json({
                success: false,
                message: "Beneficiary not found for this application",
            });
        }

        const app = beneficiary.applications.find(
            (a) => a.applicationRefId === applicationRefId
        );

        if (!app) {
            return res.status(404).json({
                success: false,
                message: "Application not found inside beneficiary",
            });
        }

        // Extra safety: ensure backend mapping is consistent
        if (app.trainerId && app.trainerId !== trainerId) {
            return res.status(403).json({
                success: false,
                message: "You are not the trainer assigned for this application",
            });
        }

        // 4. Create session
        const sessionId = `SESS-${Date.now()}`;
        const normalizedDate = new Date(date);

        trainer.sessions.push({
            sessionId,
            date: normalizedDate,
            topic,
            hours: hours || 0,
            applicationRefId,
            beneficiaryName: trainerApp.beneficiaryName,
            trainerRemarks: trainerRemarks || "",
            isCompleted: !!markAsCompleted,
            completedAt: markAsCompleted ? new Date() : null,
        });

        // Update trainer stats if completed
        if (markAsCompleted) {
            trainerApp.completedSessions = (trainerApp.completedSessions || 0) + 1;
            trainerApp.trainingProgress = recalcProgress(trainerApp);
        }
        trainerApp.lastUpdated = new Date();

        await trainer.save();

        // 5. Push session into beneficiary application
        app.trainingSessions.push({
            sessionId,
            date: normalizedDate,
            topic,
            hours: hours || 0,
            trainerRemarks: trainerRemarks || "",
            isCompleted: !!markAsCompleted,
        });

        // Sync aggregate training info when completed
        if (markAsCompleted) {
            app.completedSessions = trainerApp.completedSessions;
            app.trainingProgress = trainerApp.trainingProgress;

            if (app.trainingProgress >= 100) {
                app.trainingStatus = "COMPLETED";
                app.status = "TRAINING_COMPLETED";
            } else {
                app.trainingStatus = "ONGOING";
            }
        } else {
            // If first session and not completed, at least mark as ONGOING
            if (app.trainingStatus === "NOT_STARTED") {
                app.trainingStatus = "ONGOING";
            }
        }

        await beneficiary.save();

        return res.status(201).json({
            success: true,
            message: "Training session added successfully",
            data: { sessionId, applicationRefId },
        });
    } catch (err) {
        console.error("addTrainingSession:", err);
        return res.status(500).json({
            success: false,
            message: "Error adding session",
            error: err.message,
        });
    }
};

/* ---------------------------------------------------
   4) TRAINER DASHBOARD
--------------------------------------------------- */
export const getTrainerDashboard = async (req, res) => {
    try {
        const trainerIdFromToken = req.user?.trainerId;
        const { trainerId: trainerIdQuery } = req.query;

        const trainerId = trainerIdFromToken || trainerIdQuery;

        if (!trainerId) {
            return res.status(400).json({
                success: false,
                message: "trainerId missing",
            });
        }

        const trainer = await Trainer.findOne({ trainerId });

        if (!trainer) {
            return res.status(404).json({
                success: false,
                message: "Trainer not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                trainerId: trainer.trainerId,
                name: trainer.name,
                centerName: trainer.centerName,
                assignedApplications: trainer.assignedApplications,
                sessions: trainer.sessions,
            },
        });
    } catch (err) {
        console.error("getTrainerDashboard:", err);
        return res.status(500).json({
            success: false,
            message: "Error fetching trainer dashboard",
            error: err.message,
        });
    }
};

/* ---------------------------------------------------
   5) BENEFICIARY VIEW TRAINING PROGRESS
--------------------------------------------------- */
export const getBeneficiaryTrainingDetails = async (req, res) => {
    try {
        const { applicationRefId } = req.params;

        if (!applicationRefId) {
            return res.status(400).json({
                success: false,
                message: "applicationRefId is required",
            });
        }

        const beneficiary = await Beneficiary.findOne({
            "applications.applicationRefId": applicationRefId,
        });

        if (!beneficiary) {
            return res.status(404).json({
                success: false,
                message: "Beneficiary not found for this application",
            });
        }

        const app = beneficiary.applications.find(
            (a) => a.applicationRefId === applicationRefId
        );

        if (!app) {
            return res.status(404).json({
                success: false,
                message: "Application not found inside beneficiary",
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                beneficiaryName: beneficiary.name,
                beneficiaryId: beneficiary._id,
                district: beneficiary.district,
                state: beneficiary.state,
                applicationRefId,
                schemeName: app.schemeName,
                schemeCategory: app.schemeCategory,
                trainingStatus: app.trainingStatus,
                trainingProgress: app.trainingProgress,
                trainerId: app.trainerId,
                trainingSkill: app.trainingSkill,
                trainingCenterAssigned: app.trainingCenterAssigned,
                trainingStartDate: app.trainingStartDate,
                trainingEndDate: app.trainingEndDate,
                totalSessions: app.totalSessions,
                completedSessions: app.completedSessions,
                trainingSessions: app.trainingSessions,
            },
        });
    } catch (err) {
        console.error("getBeneficiaryTrainingDetails:", err);
        return res.status(500).json({
            success: false,
            message: "Error fetching beneficiary training details",
            error: err.message,
        });
    }
};
