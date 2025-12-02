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
            type: mongoose.Schema.Types.ObjectId,
            ref: "Application"
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Beneficiary", beneficiarySchema);
