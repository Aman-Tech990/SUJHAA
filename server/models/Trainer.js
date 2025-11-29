import mongoose from "mongoose";

const trainerSchema = new mongoose.Schema({

    trainerId: { type: String, required: true, unique: true }, // TRN-OD-KHO-01

    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },

    specialization: [String], // ["Mobile Repair", "Tailoring"]

    district: { type: String, required: true },
    state: { type: String, required: true },

    centerName: { type: String, required: true },
    centerAddress: { type: String, required: true },

    // BENEFICIARIES ASSIGNED to this trainer
    assignedApplications: [
        {
            applicationRefId: { type: String },  // APP-xxxxxx
            beneficiaryName: String,
            skill: String,

            trainingStartDate: Date,
            trainingEndDate: Date,

            totalSessions: { type: Number, default: 0 },
            completedSessions: { type: Number, default: 0 },
            trainingProgress: { type: Number, default: 0 },

            // Store last updated timestamp for audits
            lastUpdated: { type: Date }
        }
    ],

    // TRAINING SESSIONS CREATED BY TRAINER
    sessions: [
        {
            sessionId: String,         // e.g., SESS-TRN-01
            date: Date,
            topic: String,
            hours: Number,

            applicationRefId: String,  // session belongs to which application
            beneficiaryName: String,

            trainerRemarks: String,
            isCompleted: { type: Boolean, default: false },
            completedAt: Date
        }
    ],

    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Trainer", trainerSchema);
