import mongoose from "mongoose";

const schemeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: String,
    description: String,
    eligibility: [String],
    requiredDocuments: [String],
    benefits: String,
    department: String,
    state: { type: String, default: "All India" },
    trainingModules: [
        {
            title: String,
            videoUrl: String
        }
    ]

}, { timestamps: true });

export const Scheme = mongoose.model("Scheme", schemeSchema);
