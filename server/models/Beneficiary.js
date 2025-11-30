import mongoose from "mongoose";

const beneficiarySchema = new mongoose.Schema({
    digitalId: { type: String, required: true, unique: true },

    name: { type: String, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },

    aadhaarNumber: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },

    // Documents
    regPhotoUrl: { type: String, required: true },
    aadhaarUrl: String,
    casteCertificateUrl: String,
    domicileUrl: String,
    incomeCertificateUrl: String,   // FIXED camelCase

    passwordHash: { type: String, required: true },

    latitude: Number,
    longitude: Number,

    isVerified: { type: Boolean, default: false },
    otpCode: String,
    otpExpiresAt: Date,

    // Applications
    applications: [
        {
            applicationRefId: { type: String },

            schemeName: String,
            schemeCategory: {
                type: String,
                enum: ["INCOME_GENERATION", "SKILL_DEVELOPMENT", "INFRASTRUCTURE_SUPPORT"]
            },

            appliedAt: { type: Date, default: Date.now },

            status: {
                type: String,
                enum: [
                    "PENDING",
                    "UNDER_VERIFICATION",
                    "APPROVED",
                    "REJECTED",
                    "STATE_APPROVED",
                    "STATE_REJECTED",
                    "CENTRAL_APPROVED",
                    "CENTRAL_REJECTED",
                    "TRAINING_ASSIGNED",
                    "TRAINING_ONGOING",
                    "TRAINING_COMPLETED"
                ],
                default: "PENDING"
            },

            statusHistory: [
                {
                    status: String,
                    changedAt: { type: Date, default: Date.now },
                    changedByRole: String,
                    changedById: String
                }
            ],

            // FIELD OFFICER VERIFICATION
            fieldOfficerVerification: {
                verified: { type: Boolean, default: false },
                officerId: String,
                photoUrl: String,
                latitude: Number,
                longitude: Number,
                timestamp: Date
            },

            // DISTRICT LEVEL
            districtOfficerComments: String,
            districtOfficerId: String,

            // STATE LEVEL
            stateOfficerComments: String,
            stateOfficerId: String,

            // TRAINING ASSIGNMENT (CENTRAL ADMIN)
            trainerId: { type: String },
            trainerName: { type: String },
            trainerPhone: { type: String },
            trainerEmail: { type: String },

            trainingSkill: { type: String },

            trainingCenterAssigned: String,
            trainingStartDate: Date,
            trainingEndDate: Date,

            totalSessions: { type: Number, default: 0 },
            completedSessions: { type: Number, default: 0 },

            // TRAINING SESSIONS
            trainingSessions: [
                {
                    sessionId: String,
                    date: Date,
                    topic: String,
                    hours: Number,
                    trainerRemarks: String,
                    isCompleted: { type: Boolean, default: false }
                }
            ],

            trainingStatus: {
                type: String,
                enum: ["NOT_STARTED", "ONGOING", "COMPLETED"],
                default: "NOT_STARTED"
            },

            trainingProgress: { type: Number, default: 0 },   // 0–100,

            funds: [
                {
                    installmentNumber: Number,      // 1,2,3,4
                    purpose: String,                // e.g., "Training Assigned"
                    amount: Number,
                    status: {
                        type: String,
                        enum: ["PENDING", "RELEASED", "FAILED"],
                        default: "PENDING"
                    },
                    releasedAt: Date,
                    utrNumber: String
                }
            ],
            enterpriseKit: {
                distributed: { type: Boolean, default: false },
                kitDetails: String,
                distributedAt: Date
            },
        }
    ],

    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Beneficiary", beneficiarySchema);
