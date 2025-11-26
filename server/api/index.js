// Load environment variables
import dotenv from "dotenv";
dotenv.config({});

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from "../config/database.js";

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://sujhaa-frontend.vercel.app"
    ],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'SUJHAA Backend API is running!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API Info Route
app.get('/api', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'SUJHAA API v1.0',
        endpoints: {
            health: 'GET /',
            info: 'GET /api',
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login'
            },
            beneficiary: {
                profile: 'GET /api/beneficiary/profile',
                schemes: 'GET /api/beneficiary/schemes',
                apply: 'POST /api/beneficiary/apply'
            },
            officer: {
                dashboard: 'GET /api/officer/dashboard',
                verify: 'POST /api/officer/verify'
            }
        }
    });
});

// Test MongoDB Connection Route
app.get('/api/health', async (req, res) => {
    try {
        const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';

        res.status(200).json({
            success: true,
            message: 'Health check',
            database: dbStatus,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Health check failed',
            error: error.message
        });
    }
});

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
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export for Vercel serverless
export default app;