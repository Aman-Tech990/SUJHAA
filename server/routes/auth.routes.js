import express from "express";
import { universalLogin } from "../controllers/authController.js";
import { registerBeneficiary, verifyOtp } from "../controllers/authController.js";
import upload from "../middlewares/multer.js";
import { logoutBeneficiary } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", upload.single("regPhoto"), registerBeneficiary);
router.post("/verify-otp", verifyOtp);
router.post("/login", universalLogin);
router.post("/logout", logoutBeneficiary);

export default router;
