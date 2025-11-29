// Load environment variables
import dotenv from "dotenv";
dotenv.config({});

import express from 'express';
import cors from 'cors';
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
import cookieParser from "cookie-parser";

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: "*",
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health Check Route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'SUJHAA Backend API is running!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// APIs Routes
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

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5005;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export for Vercel serverless
export default app;