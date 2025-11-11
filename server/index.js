import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import beneficiaryRoutes from "./routes/beneficiary.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";
import verificationRoutes from "./routes/verification.routes.js";
import misRoutes from "./routes/mis.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();

// Database Connection
connectDB();

// Express App
const app = express();

// CORS 
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


// Default Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

// REST APIs
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/beneficiaries", beneficiaryRoutes);
app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/v1/verifications", verificationRoutes);
app.use("/api/v1/mis", misRoutes);

// Check
app.get("/", (req, res) => {
    res.send("SUJHAA Backend");
});

// PORT & Entry-point
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
