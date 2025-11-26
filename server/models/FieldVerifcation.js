import mongoose from 'mongoose';

const fieldVerificationSchema = new mongoose.Schema({
    // Verification ID
    verification_id: {
        type: String,
        unique: true,
        required: true
    },

    // References
    application_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
        required: true
    },

    beneficiary_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Beneficiary',
        required: true
    },

    field_officer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FieldOfficer',
        required: true
    },

    // Photos (Cloudinary URLs)
    field_photo_url: {
        type: String,
        required: true
    },

    proof_photo_url: {
        type: String,
        required: true
    },

    // Current Location (Field Officer's location)
    current_lat: {
        type: Number,
        required: true
    },

    current_lng: {
        type: Number,
        required: true
    },

    // Distance Calculation
    distance_km: {
        type: Number,
        required: true
    },

    // Location Verification
    location_status: {
        type: String,
        required: true
    },

    location_threshold_km: {
        type: Number,
        default: 10
    },

    // Face Recognition
    face_match_score: {
        type: Number
    },

    face_status: {
        type: String,
        default: 'PENDING'
    },

    face_match_threshold: {
        type: Number,
        default: 0.8
    },

    // Proof Status
    proof_status: {
        type: String,
        default: 'MISSING'
    },

    // Final Status
    final_status: {
        type: String,
        default: 'PENDING'
    },

    // Officer Input
    remarks: {
        type: String,
        required: true
    },

    officer_recommendation: {
        type: String,
        required: true
    },

    // Additional Info
    beneficiary_present: {
        type: Boolean,
        default: true
    },

    beneficiary_cooperative: {
        type: Boolean,
        default: true
    },

    infrastructure_available: {
        type: Boolean,
        default: false
    },

    additional_notes: {
        type: String
    },

    // Metadata
    verification_date: {
        type: Date,
        default: Date.now
    },

    verification_time: {
        type: String
    }

}, {
    timestamps: true
});

const FieldVerification = mongoose.model('FieldVerification', fieldVerificationSchema);

export default FieldVerification;