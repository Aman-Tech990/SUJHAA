import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
    // Skill ID
    skill_id: {
        type: String,
        unique: true,
        required: true
    },

    // Skill Information
    skill_name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    // Category
    category: {
        type: String,
        required: true
    },

    // Link to Scheme (1:1 relationship)
    scheme_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scheme',
        required: true,
        unique: true
    },

    // Link to Training Center
    training_center_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrainingCenter',
        required: true
    },

    // Training Details
    total_sessions: {
        type: Number,
        required: true,
        default: 30
    },

    session_duration_hours: {
        type: Number,
        default: 2
    },

    // Skill Level
    level: {
        type: String,
        default: 'BEGINNER'
    },

    // Prerequisites
    prerequisites: {
        type: String,
        default: 'None'
    },

    // Certification
    certification_name: {
        type: String
    },

    // Status
    is_active: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

const Skill = mongoose.model('Skill', skillSchema);

export default Skill;