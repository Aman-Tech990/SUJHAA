import express from "express";
import { authBeneficiary } from "../middlewares/authBeneficiary.js";
import { getMyProfile } from "../controllers/authController.js";


const router = express.Router();

// Protected route: fetch logged-in beneficiary profile
router.get("/profile", authBeneficiary, getMyProfile);

export default router;
