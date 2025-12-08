// Load environment variables
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "../config/database.js";

import authRoutes from "../routes/auth.routes.js";
import beneficiaryRoutes from "../routes/beneficiary.routes.js";
import ocrRoutes from "../routes/ocr.routes.js";
import applicationRoutes from "../routes/application.routes.js";
import schemeRoutes from "../routes/scheme.routes.js";
import fieldOfficerRoutes from "../routes/fieldOfficer.routes.js";
import districtRoutes from "../routes/districtOfficer.routes.js";
import stateRoutes from "../routes/stateOfficer.routes.js";
import trainingRoutes from "../routes/training.routes.js";
import centralRoutes from "../routes/centralOfficer.routes.js";

const app = express();

// Connect DB
connectDB();

// Middlewares
app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps, Expo, Postman)
            if (!origin) return callback(null, true);

            return callback(null, true); // allow all origins dynamically
        },
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "SUJHAA Backend API is running!",
        timestamp: new Date().toISOString(),
    });
});


// Routes
app.use("/api/ocr", ocrRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/beneficiary", beneficiaryRoutes);
app.use("/api/application", applicationRoutes);
app.use("/api/schemes", schemeRoutes);
app.use("/api/field", fieldOfficerRoutes);
app.use("/api/district", districtRoutes);
app.use("/api/state", stateRoutes);
app.use("/api/training", trainingRoutes);
app.use("/api/central", centralRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message,
    });
});

// LISTEN (required for RENDER & LOCAL)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
