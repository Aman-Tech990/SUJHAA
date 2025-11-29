import mongoose from "mongoose";

const officerSchema = new mongoose.Schema({
    officerId: { type: String, required: true, unique: true },

    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,

    role: {
        type: String,
        enum: ["CENTRAL_ADMIN", "STATE_OFFICER", "DISTRICT_OFFICER", "FIELD_OFFICER", "TRAINER", "TRAINING_ADMIN"],
        required: true
    },

    district: String,
    state: String,

    passwordHash: { type: String, required: true },

    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Officer", officerSchema);
