import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Beneficiary from "../models/Beneficiary.js";
import { generateDigitalId } from "../utils/generateDigitalId.js";
import { sendOtpEmail } from "../services/email.service.js";
import { uploadBufferToCloudinary } from "../services/cloudinary.service.js";
import { getCoordinates } from "../services/geocode.service.js";
import Officer from "../models/Officer.js";

// Generate 6-digit OTP
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// ==========================
// REGISTER BENEFICIARY
// ==========================
export const registerBeneficiary = async (req, res) => {
    try {
        const {
            name,
            gender,
            email,
            phone,
            aadhaarNumber,
            address,
            district,
            state,
            password
        } = req.body;

        const regPhoto = req.file;

        if (!regPhoto) {
            return res.status(400).json({
                success: false,
                message: "Registration photo required"
            });
        }

        // Check duplicate Aadhaar or email
        const existing = await Beneficiary.findOne({
            $or: [{ email }, { aadhaarNumber }]
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Email or Aadhaar already registered"
            });
        }

        // STEP 1: Convert Address -> Lat/Lng
        const { lat, lng } = await getCoordinates(address);

        // STEP 2: Upload photo to Cloudinary
        const regPhotoUrl = await uploadBufferToCloudinary(
            req.file.buffer,
            "sujhaa/registration_photos"
        );

        // Generate Digital ID & OTP
        const digitalId = generateDigitalId();
        const otp = generateOtp();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        const passwordHash = await bcrypt.hash(password, 10);

        // Create beneficiary
        await Beneficiary.create({
            digitalId,
            name,
            gender,
            email,
            phone,
            aadhaarNumber,
            address,
            district,
            state,
            regPhotoUrl,
            latitude: lat,
            longitude: lng,
            passwordHash,
            otpCode: otp,
            otpExpiresAt,
            isVerified: false
        });

        // Send OTP email
        await sendOtpEmail({ to: email, name, digitalId, otp });

        return res.json({
            success: true,
            message: "Registration successful. OTP sent to email.",
            digitalId
        });

    } catch (err) {
        console.error("REGISTER ERROR:", err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// ==========================
// VERIFY OTP
// ==========================
export const verifyOtp = async (req, res) => {
    try {
        const { digitalId, otp } = req.body;

        const user = await Beneficiary.findOne({ digitalId });

        if (!user)
            return res.status(400).json({ success: false, message: "Invalid Digital ID" });

        if (user.otpCode !== otp)
            return res.status(400).json({ success: false, message: "Invalid OTP" });

        if (user.otpExpiresAt < new Date())
            return res.status(400).json({ success: false, message: "OTP expired" });

        user.isVerified = true;
        user.otpCode = null;
        user.otpExpiresAt = null;
        await user.save();

        return res.json({
            success: true,
            message: "OTP verified successfully"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// ==========================
// LOGIN BENEFICIARY
// ==========================
export const universalLogin = async (req, res) => {
    try {
        const { digitalId, password } = req.body;

        // 1️⃣ Validate input
        if (!digitalId || !password) {
            return res.status(400).json({
                success: false,
                message: "Digital ID and password are required"
            });
        }

        let user = null;
        let role = null;

        // 2️⃣ Identify user type
        if (digitalId.startsWith("SUJHAA")) {
            user = await Beneficiary.findOne({ digitalId })
            role = "BENEFICIARY";
        }
        else if (digitalId.startsWith("ADMIN")) {
            user = await Officer.findOne({ officerId: digitalId });
            role = "CENTRAL_ADMIN";
        }
        else if (digitalId.startsWith("FO")) {
            user = await Officer.findOne({ officerId: digitalId });
            role = "FIELD_OFFICER";
        }
        else if (digitalId.startsWith("DO")) {
            user = await Officer.findOne({ officerId: digitalId });
            role = "DISTRICT_OFFICER";
        }
        else if (digitalId.startsWith("SO")) {
            user = await Officer.findOne({ officerId: digitalId });
            role = "STATE_OFFICER";
        }
        else if (digitalId.startsWith("TRN")) {
            user = await Trainer.findOne({ trainerId: digitalId });
            role = "TRAINER";
        }
        else {
            return res.status(400).json({
                success: false,
                message: "Invalid Digital ID format"
            });
        }

        // 3️⃣ Check user existence
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // 4️⃣ Verify password
        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            });
        }

        // 5️⃣ Create token
        const token = jwt.sign(
            { id: user._id, digitalId, role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 6️⃣ Send response
        return res
            .cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            .json({
                success: true,
                message: "Login successful",
                role,
                user
            });

    } catch (err) {
        console.error("LOGIN ERROR:", err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// ==========================
// LOGOUT BENEFICIARY
// ==========================
export const logoutBeneficiary = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Logout failed",
            error: err.message
        });
    }
};

export const getMyProfile = async (req, res) => {
    try {
        const { digitalId } = req.user; // From authBeneficiary JWT

        const user = await Beneficiary.findOne({ digitalId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Beneficiary not found"
            });
        }

        // Prepare clean profile response
        const profile = {
            digitalId: user.digitalId,
            name: user.name,
            email: user.email,
            phone: user.phone,
            district: user.district,
            state: user.state,
            address: user.address,
            latitude: user.latitude,
            longitude: user.longitude,
            regPhotoUrl: user.regPhotoUrl,
            isVerified: user.isVerified,
            createdAt: user.createdAt,

            documents: {
                aadhaarUrl: user.aadhaarUrl || null,
                casteCertificateUrl: user.casteCertificateUrl || null,
                domicileUrl: user.domicileUrl || null,
                incomeCertificateUrl: user.incomeCertificateUrl || null
            },

            applications: user.applications.map(app => ({
                schemeName: app.schemeName,
                status: app.status,
                appliedAt: app.appliedAt,
                applicationRefId: app.applicationRefId
            })),

            totalApplications: user.applications.length
        };

        return res.json({
            success: true,
            profile
        });

    } catch (err) {
        console.error("PROFILE ERROR:", err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};