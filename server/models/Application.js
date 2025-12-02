import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
    {
        /* ---------------------------------------------------------
           BASIC IDENTIFIERS
        --------------------------------------------------------- */
        application_id: {
            type: String,
            unique: true,
            required: true,
        },

        beneficiary_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Beneficiary",
            required: true,
        },

        scheme_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Scheme",
            required: true,
        },

        /* ---------------------------------------------------------
           APPLICATION STATUS
        --------------------------------------------------------- */

        // FULL STATUS FLOW:
        // SUBMITTED → UNDER_VERIFICATION → DISTRICT_APPROVED → STATE_APPROVED → CENTRAL_APPROVED
        // → TRAINING_ASSIGNED → TRAINING_COMPLETED → FUNDS_RELEASED → KIT_DISTRIBUTED
        status: {
            type: String,
            enum: [
                "SUBMITTED",
                "UNDER_VERIFICATION",
                "DISTRICT_APPROVED",
                "DISTRICT_REJECTED",
                "STATE_APPROVED",
                "STATE_REJECTED",
                "CENTRAL_APPROVED",
                "CENTRAL_REJECTED",
                "TRAINING_ASSIGNED",
                "TRAINING_COMPLETED",
                "FUNDS_RELEASED",
                "KIT_DISTRIBUTED",
            ],
            default: "UNDER_VERIFICATION",
        },

        /* ---------------------------------------------------------
           DOCUMENTS (Uploaded at time of application)
        --------------------------------------------------------- */
        uploaded_docs: {
            income_certificate: { type: String, required: true },
            domicile_certificate: { type: String, required: true },
            caste_certificate: { type: String, required: true },
        },

        /* ---------------------------------------------------------
           FIELD VERIFICATION
        --------------------------------------------------------- */
        field_verification_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FieldVerification",
        },

        /* FIELD VERIFIED FLAGS */
        field_verified: { type: Boolean, default: false },
        field_verified_at: { type: Date },

        /* ---------------------------------------------------------
           DISTRICT LEVEL
        --------------------------------------------------------- */
        district_approved_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DistrictOfficer",
        },
        district_approved_at: { type: Date },
        district_remarks: { type: String },

        /* ---------------------------------------------------------
           STATE LEVEL
        --------------------------------------------------------- */
        state_approved_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "StateOfficer",
        },
        state_approved_at: { type: Date },
        state_remarks: { type: String },

        /* ---------------------------------------------------------
           CENTRAL LEVEL
        --------------------------------------------------------- */
        central_approved_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CentralAdmin",
        },
        central_approved_at: { type: Date },
        central_remarks: { type: String },

        /* ---------------------------------------------------------
           TRAINING WORKFLOW (PM-AJAY Requirement)
        --------------------------------------------------------- */
        training: {
            center: String,
            skill: String,
            startDate: Date,
            endDate: Date,
            progress: { type: Number, default: 0 }, // percent
            status: {
                type: String,
                enum: ["NOT_ASSIGNED", "ONGOING", "COMPLETED"],
                default: "NOT_ASSIGNED",
            },
        },

        /* ---------------------------------------------------------
           FUND RELEASE (DBT)
        --------------------------------------------------------- */
        funds: [
            {
                amount: Number,
                releasedAt: Date,
                status: {
                    type: String,
                    enum: ["PENDING", "RELEASED"],
                    default: "PENDING",
                },
            },
        ],

        /* ---------------------------------------------------------
           ENTERPRISE KIT DISTRIBUTION
        --------------------------------------------------------- */
        enterpriseKit: {
            distributed: { type: Boolean, default: false },
            distributedAt: Date,
        },

        /* ---------------------------------------------------------
           STATUS HISTORY (TIMELINE)
        --------------------------------------------------------- */
        statusHistory: [
            {
                status: String,
                changedAt: { type: Date, default: Date.now },
                changedByRole: String,
                changedById: mongoose.Schema.Types.ObjectId,
            },
        ],

        /* ---------------------------------------------------------
           OTHER FIELDS
        --------------------------------------------------------- */
        rejection_reason: String,
        rejected_by: String, // officer role
        rejected_at: Date,

        applied_date: {
            type: Date,
            default: Date.now,
        },

        is_active: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Application", applicationSchema);
