import mongoose from 'mongoose';

const schemeSchema = new mongoose.Schema({
    // Scheme ID
    scheme_id: {
        type: String,
        unique: true,
        required: true
    },

    // Scheme Information
    scheme_name: {
        type: String,
        required: true,
        unique: true
    },

    description: {
        type: String,
        required: true
    },

    // Eligibility
    eligibility_criteria: {
        type: String,
        required: true
    },

    // Fund Amount
    total_fund_amount: {
        type: Number,
        required: true
    },

    // Link to Skill (1:1 relationship)
    skill_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill'
    },

    // Required Documents
    required_documents: {
        type: [String],
        default: ['Income Certificate', 'Domicile Certificate', 'Caste Certificate']
    },

    // Scheme Details
    duration_months: {
        type: Number,
        default: 6
    },

    target_beneficiaries: {
        type: Number,
        default: 0
    },

    enrolled_count: {
        type: Number,
        default: 0
    },

    // Status
    is_active: {
        type: Boolean,
        default: true
    },

    launch_date: {
        type: Date,
        default: Date.now
    },

    deadline: {
        type: Date
    }

}, {
    timestamps: true
});

const Scheme = mongoose.model('Scheme', schemeSchema);

export default Scheme;