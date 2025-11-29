import mongoose from "mongoose";

const schemeSchema = new mongoose.Schema({
    schemeId: { type: String, required: true, unique: true },  // e.g., SCH-001

    name: { type: String, required: true },

    category: {
        type: String,
        enum: ["INCOME_GENERATION", "SKILL_DEVELOPMENT", "INFRASTRUCTURE_SUPPORT"],
        required: true
    },

    description: String,

    // Scheme duration
    startDate: Date,
    endDate: Date,
    durationInDays: Number,   // optional (we can auto-calc)

    // Eligibility rules
    eligibility: {
        minAge: Number,
        maxAge: Number,
        casteRequired: { type: Boolean, default: true },
        incomeLimit: Number
    },

    // Documents required per scheme
    requiredDocuments: [
        {
            docName: String,           // e.g. "Income Certificate"
            isMandatory: Boolean
        }
    ],

    // Budget / Funding
    maxFundingAmount: Number,

    // Scheme status
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE", "CLOSED", "UPCOMING"],
        default: "ACTIVE"
    },

    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Scheme", schemeSchema);
