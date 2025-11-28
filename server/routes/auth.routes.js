import express from "express";
import { registerBeneficiary, verifyOtp, loginBeneficiary } from "../controllers/authController.js";
import upload from "../middlewares/multer.js";
import { logoutBeneficiary } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", upload.single("regPhoto"), registerBeneficiary);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginBeneficiary);
router.post("/logout", logoutBeneficiary);

export default router;
