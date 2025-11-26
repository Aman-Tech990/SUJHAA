import mongoose from 'mongoose';

const trainingCenterSchema = new mongoose.Schema({
    // Center ID
    center_id: {
        type: String,
        unique: true,
        required: true
    },

    // Center Information
    center_name: {
        type: String,
        required: true
    },

    center_code: {
        type: String,
        unique: true,
        required: true
    },

    // Address
    address: {
        type: String,
        required: true
    },

    city: {
        type: String,
        required: true
    },

    district_id: {
        type: String,
        required: true
    },

    state_id: {
        type: String,
        required: true
    },

    // Location
    latitude: {
        type: Number
    },

    longitude: {
        type: Number
    },

    // Contact
    contact_number: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    // Trainer Information
    trainer_name: {
        type: String,
        required: true
    },

    trainer_qualification: {
        type: String,
        required: true
    },

    trainer_experience_years: {
        type: Number,
        default: 0
    },

    trainer_mobile: {
        type: String,
        required: true
    },

    // Login Password
    password: {
        type: String,
        required: true
    },

    // Skills Handled
    skills_handled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill'
    }],

    // Capacity
    max_capacity: {
        type: Number,
        default: 30
    },

    current_enrollment: {
        type: Number,
        default: 0
    },

    // Facilities
    facilities: {
        type: [String],
        default: []
    },

    // Status
    is_active: {
        type: Boolean,
        default: true
    },

    is_verified: {
        type: Boolean,
        default: false
    },

    // Accreditation
    accreditation_number: {
        type: String
    },

    accreditation_body: {
        type: String
    },

    last_login: {
        type: Date
    }

}, {
    timestamps: true
});

const TrainingCenter = mongoose.model('TrainingCenter', trainingCenterSchema);

export default TrainingCenter;