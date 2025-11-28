import mongoose from "mongoose";

const beneficiarySchema = new mongoose.Schema({
    digitalId: { type: String, required: true, unique: true },

    name: { type: String, required: true },
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
            applicationRefId: { type: String, unique: true },

            schemeName: String,

            schemeCategory: {
                type: String,
                enum: ["INCOME_GENERATION", "SKILL_DEVELOPMENT", "INFRASTRUCTURE_SUPPORT"]
            },

            appliedAt: { type: Date, default: Date.now },

            status: {
                type: String,
                enum: ["PENDING", "UNDER_VERIFICATION", "APPROVED", "REJECTED"],
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

            fieldOfficerVerification: {
                verified: { type: Boolean, default: false },
                officerId: String,
                photoUrl: String,
                latitude: Number,
                longitude: Number,
                timestamp: Date
            },

            districtOfficerComments: String,
            districtOfficerId: String,

            stateOfficerComments: String,
            stateOfficerId: String,

            trainingCenterAssigned: String,
            trainingStartDate: Date,
            trainingEndDate: Date,
            trainingProgress: { type: Number, default: 0 }
        }
    ],

    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Beneficiary", beneficiarySchema);
