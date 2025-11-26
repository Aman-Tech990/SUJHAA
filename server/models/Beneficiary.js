import mongoose from 'mongoose';

const beneficiarySchema = new mongoose.Schema({
    // Digital ID
    beneficiary_id: {
        type: String,
        unique: true,
        required: true
    },

    // Personal Information
    name: {
        type: String,
        required: true
    },

    aadhaar_number: {
        type: String,
        required: true,
        unique: true
    },

    mobile_number: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    // Address
    address_text: {
        type: String,
        required: true
    },

    registered_lat: {
        type: Number,
        required: true
    },

    registered_lng: {
        type: Number,
        required: true
    },

    // Photo URL (from Cloudinary)
    reg_photo_url: {
        type: String,
        required: true
    },

    // Location IDs
    district_id: {
        type: String,
        required: true
    },

    state_id: {
        type: String,
        required: true
    },

    // Status
    is_verified: {
        type: Boolean,
        default: false
    },

    is_active: {
        type: Boolean,
        default: true
    },

    // OTP
    otp: {
        type: String
    },

    otp_expiry: {
        type: Date
    }

}, {
    timestamps: true
});

const Beneficiary = mongoose.model('Beneficiary', beneficiarySchema);

export default Beneficiary;