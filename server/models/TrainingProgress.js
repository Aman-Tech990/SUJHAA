import mongoose from 'mongoose';

const trainingProgressSchema = new mongoose.Schema({
    // Progress ID
    progress_id: {
        type: String,
        unique: true,
        required: true
    },

    // References
    beneficiary_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Beneficiary',
        required: true
    },

    scheme_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scheme',
        required: true
    },

    skill_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
        required: true
    },

    center_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrainingCenter',
        required: true
    },

    // Training Details
    total_sessions: {
        type: Number,
        required: true
    },

    sessions_completed: {
        type: Number,
        default: 0
    },

    // Attendance Records
    attendance_records: [{
        date: Date,
        status: String, // PRESENT, ABSENT
        session_number: Number
    }],

    // Trainer Remarks
    trainer_remarks: {
        type: String
    },

    // Status
    status: {
        type: String,
        default: 'NOT_STARTED'
    },

    // Dates
    training_start_date: {
        type: Date
    },

    training_end_date: {
        type: Date
    },

    completion_date: {
        type: Date
    }

}, {
    timestamps: true
});

const TrainingProgress = mongoose.model('TrainingProgress', trainingProgressSchema);

export default TrainingProgress;