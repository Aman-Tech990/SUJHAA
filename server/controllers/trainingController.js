// controllers/trainingController.js
import Beneficiary from "../models/Beneficiary.js";
import Trainer from "../models/Trainer.js";

// Small helper to recalc training progress for one application
function recalcTrainingFromTrainerApp(trainerApp) {
    if (!trainerApp.totalSessions || trainerApp.totalSessions === 0) return 0;
    const progress = (trainerApp.completedSessions / trainerApp.totalSessions) * 100;
    return Math.min(100, Math.round(progress));
}

/**
 * CENTRAL OFFICER:
 * Assign training to a beneficiary application
 * - Links Beneficiary ⇄ Trainer
 * - Sets training fields
 * - Sets status to TRAINING_ASSIGNED
 */
export const assignTrainingToBeneficiary = async (req, res) => {
    try {
        // Either from req.body or req.user based on your auth
        // Assuming central officer hits this API:
        const {
            applicationRefId,
            trainerId,
            trainingSkill,
            trainingCenterAssigned,
            trainingStartDate,
            trainingEndDate,
            totalSessions,
        } = req.body;

        if (!applicationRefId || !trainerId || !trainingSkill || !trainingCenterAssigned || !totalSessions) {
            return res.status(400).json({
                success: false,
                message: "applicationRefId, trainerId, trainingSkill, trainingCenterAssigned and totalSessions are required",
            });
        }

        // 1. Find Trainer
        const trainer = await Trainer.findOne({ trainerId });
        if (!trainer) {
            return res.status(404).json({ success: false, message: "Trainer not found" });
        }

        // 2. Find Beneficiary containing this application
        const beneficiary = await Beneficiary.findOne({
            "applications.applicationRefId": applicationRefId,
        });

        if (!beneficiary) {
            return res.status(404).json({
                success: false,
                message: "Beneficiary with this applicationRefId not found",
            });
        }

        // 3. Find the application inside array
        const app = beneficiary.applications.find(
            (a) => a.applicationRefId === applicationRefId
        );

        if (!app) {
            return res.status(404).json({
                success: false,
                message: "Application not found inside beneficiary",
            });
        }

        // 4. Update training-related fields in Beneficiary.application
        app.trainerId = trainerId;
        app.trainingSkill = trainingSkill;
        app.trainingCenterAssigned = trainingCenterAssigned;
        app.trainingStartDate = trainingStartDate ? new Date(trainingStartDate) : null;
        app.trainingEndDate = trainingEndDate ? new Date(trainingEndDate) : null;

        app.trainingStatus = "NOT_STARTED";
        app.trainingProgress = 0;

        // Optional: set scheme status to TRAINING_ASSIGNED
        app.status = "TRAINING_ASSIGNED";
        app.statusHistory.push({
            status: "TRAINING_ASSIGNED",
            changedAt: new Date(),
            changedByRole: "CENTRAL_OFFICER",
            changedById: req.user?.officerId || "CENTRAL_ADMIN", // adjust as per your auth
        });

        await beneficiary.save();

        // 5. Update Trainer.assignedApplications
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
                totalSessions: totalSessions,
                completedSessions: 0,
                trainingProgress: 0,
                lastUpdated: new Date(),
            });
        } else {
            // If already exists, update it
            trainerApp.skill = trainingSkill;
            trainerApp.trainingStartDate = app.trainingStartDate;
            trainerApp.trainingEndDate = app.trainingEndDate;
            trainerApp.totalSessions = totalSessions;
            trainerApp.completedSessions = 0;
            trainerApp.trainingProgress = 0;
            trainerApp.lastUpdated = new Date();
        }

        await trainer.save();

        return res.status(200).json({
            success: true,
            message: "Training assigned successfully",
            data: {
                beneficiaryId: beneficiary._id,
                applicationRefId,
                trainerId,
            },
        });
    } catch (err) {
        console.error("assignTrainingToBeneficiary error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error while assigning training",
        });
    }
};

/**
 * TRAINER:
 * Add a training session (optionally mark completed)
 * - Adds session entry in Trainer.sessions
 * - Adds session entry in Beneficiary.applications[].trainingSessions
 * - Updates completedSessions / trainingProgress in Trainer & Beneficiary
 */
export const addTrainingSession = async (req, res) => {
    try {
        // Trainer will be authenticated, we read trainerId from token ideally
        const trainerIdFromToken = req.user?.trainerId; // adjust based on your auth
        const {
            trainerId,            // fallback if not from token
            applicationRefId,
            date,
            topic,
            hours,
            trainerRemarks,
            markAsCompleted,      // boolean
        } = req.body;

        const finalTrainerId = trainerIdFromToken || trainerId;

        if (!finalTrainerId || !applicationRefId || !date || !topic) {
            return res.status(400).json({
                success: false,
                message: "trainerId, applicationRefId, date, topic are required",
            });
        }

        // 1. Find Trainer
        const trainer = await Trainer.findOne({ trainerId: finalTrainerId });
        if (!trainer) {
            return res.status(404).json({ success: false, message: "Trainer not found" });
        }

        // Check that this application is actually assigned to this trainer
        let trainerApp = trainer.assignedApplications.find(
            (t) => t.applicationRefId === applicationRefId
        );

        if (!trainerApp) {
            return res.status(403).json({
                success: false,
                message: "This application is not assigned to this trainer",
            });
        }

        // 2. Generate a simple sessionId
        const sessionId = `SESS-${Date.now()}`;

        // 3. Push session into Trainer.sessions
        trainer.sessions.push({
            sessionId,
            date: new Date(date),
            topic,
            hours: hours || 0,
            applicationRefId,
            beneficiaryName: trainerApp.beneficiaryName,
            trainerRemarks: trainerRemarks || "",
            isCompleted: !!markAsCompleted,
            completedAt: markAsCompleted ? new Date() : null,
        });

        // Update counts if completed
        if (markAsCompleted) {
            trainerApp.completedSessions = (trainerApp.completedSessions || 0) + 1;
            trainerApp.trainingProgress = recalcTrainingFromTrainerApp(trainerApp);
            trainerApp.lastUpdated = new Date();
        }

        await trainer.save();

        // 4. Sync with Beneficiary side
        const beneficiary = await Beneficiary.findOne({
            "applications.applicationRefId": applicationRefId,
        });

        if (!beneficiary) {
            return res.status(404).json({
                success: false,
                message: "Beneficiary with this applicationRefId not found",
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

        // Push session into Beneficiary.trainingSessions
        app.trainingSessions.push({
            sessionId,
            date: new Date(date),
            topic,
            hours: hours || 0,
            trainerRemarks: trainerRemarks || "",
        });

        // If markAsCompleted, update training status & progress to match trainerApp
        if (markAsCompleted) {
            // Use trainerApp progress to keep in sync
            app.trainingProgress = trainerApp.trainingProgress;

            if (app.trainingProgress >= 100) {
                app.trainingStatus = "COMPLETED";
                app.status = "TRAINING_COMPLETED";

                app.statusHistory.push({
                    status: "TRAINING_COMPLETED",
                    changedAt: new Date(),
                    changedByRole: "TRAINER",
                    changedById: finalTrainerId,
                });
            } else {
                app.trainingStatus = "ONGOING";

                app.statusHistory.push({
                    status: "TRAINING_ONGOING",
                    changedAt: new Date(),
                    changedByRole: "TRAINER",
                    changedById: finalTrainerId,
                });
            }
        } else {
            // If session added but not completed, at least set status to ONGOING
            if (app.trainingStatus === "NOT_STARTED") {
                app.trainingStatus = "ONGOING";
                app.statusHistory.push({
                    status: "TRAINING_ONGOING",
                    changedAt: new Date(),
                    changedByRole: "TRAINER",
                    changedById: finalTrainerId,
                });
            }
        }

        await beneficiary.save();

        return res.status(201).json({
            success: true,
            message: "Training session added successfully",
            data: {
                sessionId,
                applicationRefId,
            },
        });
    } catch (err) {
        console.error("addTrainingSession error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error while adding training session",
        });
    }
};

/**
 * TRAINER:
 * Get all applications assigned to a trainer (for dashboard)
 */
export const getTrainerDashboard = async (req, res) => {
    try {
        const trainerIdFromToken = req.user?.trainerId;
        const { trainerId } = req.query;

        const finalTrainerId = trainerIdFromToken || trainerId;
        if (!finalTrainerId) {
            return res.status(400).json({
                success: false,
                message: "trainerId is required",
            });
        }

        const trainer = await Trainer.findOne({ trainerId: finalTrainerId });
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
        console.error("getTrainerDashboard error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching trainer dashboard",
        });
    }
};

/**
 * BENEFICIARY:
 * Get training details for one application
 */
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
                applicationRefId,
                schemeName: app.schemeName,
                trainingStatus: app.trainingStatus,
                trainingProgress: app.trainingProgress,
                trainerId: app.trainerId,
                trainingSkill: app.trainingSkill,
                trainingCenterAssigned: app.trainingCenterAssigned,
                trainingStartDate: app.trainingStartDate,
                trainingEndDate: app.trainingEndDate,
                trainingSessions: app.trainingSessions,
            },
        });
    } catch (err) {
        console.error("getBeneficiaryTrainingDetails error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching training details",
        });
    }
};
