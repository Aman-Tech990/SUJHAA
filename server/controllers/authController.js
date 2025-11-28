import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Beneficiary from "../models/Beneficiary.js";
import { generateDigitalId } from "../utils/generateDigitalId.js";
import { sendOtpEmail } from "../services/email.service.js";
import { uploadBufferToCloudinary } from "../services/cloudinary.service.js";
import { getCoordinates } from "../services/geocode.service.js";

// Generate 6-digit OTP
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// ==========================
// REGISTER BENEFICIARY
// ==========================
export const registerBeneficiary = async (req, res) => {
    try {
        const { name, email, phone, aadhaarNumber, address, password } = req.body;

        const regPhoto = req.file;

        if (!regPhoto) {
            return res.status(400).json({ success: false, message: "Registration photo required" });
        }

        // Check if email or Aadhaar already exists
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
        console.log("Geo:", lat, lng);

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

        // Create user
        await Beneficiary.create({
            digitalId,
            name,
            email,
            phone,
            aadhaarNumber,
            address,
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

        res.json({
            success: true,
            message: "Registration successful. OTP sent to email.",
            digitalId
        });

    } catch (err) {
        console.error("REGISTER ERROR:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ==========================
// VERIFY OTP
// ==========================
export const verifyOtp = async (req, res) => {
    try {
        const { digitalId, otp } = req.body;

        const user = await Beneficiary.findOne({ digitalId });

        if (!user) return res.status(400).json({ success: false, message: "Invalid Digital ID" });
        if (user.otpCode !== otp) return res.status(400).json({ success: false, message: "Invalid OTP" });

        if (user.otpExpiresAt < new Date())
            return res.status(400).json({ success: false, message: "OTP expired" });

        // Verify account
        user.isVerified = true;
        user.otpCode = null;
        user.otpExpiresAt = null;
        await user.save();

        res.json({ success: true, message: "OTP verified successfully" });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ==========================
// LOGIN (JWT COOKIE)
// ==========================
export const loginBeneficiary = async (req, res) => {
    try {
        const { digitalId, password } = req.body;

        const user = await Beneficiary.findOne({ digitalId });
        if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

        if (!user.isVerified)
            return res.status(403).json({ success: false, message: "Account not verified" });

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match)
            return res.status(400).json({ success: false, message: "Invalid credentials" });

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, role: "BENEFICIARY" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res
            .status(200)
            .cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            .json({
                success: true,
                message: "Login successful",
                user
            });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ==========================
// LOGOUT
// ==========================
export const logoutBeneficiary = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
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
