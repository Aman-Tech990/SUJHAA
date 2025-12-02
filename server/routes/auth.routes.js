import express from "express";
import { getMyProfile, universalLogin } from "../controllers/authController.js";
import { registerBeneficiary, verifyOtp } from "../controllers/authController.js";
import upload from "../middlewares/multer.js";
import { logoutBeneficiary } from "../controllers/authController.js";
import { authBeneficiary } from "../middlewares/authBeneficiary.js";

const router = express.Router();

router.post("/register", upload.single("regPhoto"), registerBeneficiary);
router.post("/verify-otp", verifyOtp);
router.post("/login", universalLogin);
router.get("/logout", logoutBeneficiary);
router.get("/profile", authBeneficiary, getMyProfile);

export default router;
