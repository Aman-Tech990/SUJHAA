import mongoose from 'mongoose';

const centralAdminSchema = new mongoose.Schema({
    // Admin ID
    admin_id: {
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

    // Admin Level
    admin_level: {
        type: String,
        default: 'SUPER_ADMIN' // Can be SUPER_ADMIN, ADMIN, etc.
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

const CentralAdmin = mongoose.model('CentralAdmin', centralAdminSchema);

export default CentralAdmin;