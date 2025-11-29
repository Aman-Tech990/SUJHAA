import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    // Application ID
    application_id: {
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
        ref: 'Skill'
    },

    // Application Status
    status: {
        type: String,
        default: 'PENDING_FIELD_VERIFICATION'
    },

    // Uploaded Documents (Cloudinary URLs)
    uploaded_docs: {
        income_certificate: {
            type: String,
            required: true
        },
        domicile_certificate: {
            type: String,
            required: true
        },
        caste_certificate: {
            type: String,
            required: true
        },
    },

    // Field Verification Reference
    field_verification_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FieldVerification'
    },

    // District Level
    district_remarks: {
        type: String
    },

    district_approved_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DistrictOfficer'
    },

    district_approved_at: {
        type: Date
    },

    // State Level
    state_remarks: {
        type: String
    },

    state_approved_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StateOfficer'
    },

    state_approved_at: {
        type: Date
    },

    // Central Level
    central_remarks: {
        type: String
    },

    central_approved_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CentralAdmin'
    },

    central_approved_at: {
        type: Date
    },

    // Rejection
    rejection_reason: {
        type: String
    },

    rejected_by: {
        type: String // Can be FieldOfficer, DistrictOfficer, StateOfficer, CentralAdmin
    },

    rejected_at: {
        type: Date
    },

    // Dates
    applied_date: {
        type: Date,
        default: Date.now
    },

    is_active: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

const Application = mongoose.model('Application', applicationSchema);

export default Application;