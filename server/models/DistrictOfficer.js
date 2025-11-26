import mongoose from 'mongoose';

const districtOfficerSchema = new mongoose.Schema({
    // Officer ID
    officer_id: {
        type: String,
        unique: true,
        required: true
    },

    // Personal Information
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    mobile_number: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    // Location Assignment
    district_id: {
        type: String,
        required: true
    },

    state_id: {
        type: String,
        required: true
    },

    // Status
    is_active: {
        type: Boolean,
        default: true
    },

    last_login: {
        type: Date
    }

}, {
    timestamps: true
});

const DistrictOfficer = mongoose.model('DistrictOfficer', districtOfficerSchema);

export default DistrictOfficer;