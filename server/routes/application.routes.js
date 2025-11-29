import express from "express";
import { authBeneficiary } from "../middlewares/authBeneficiary.js";

import {
    applyForScheme,
    getMyApplications
} from "../controllers/application.controller.js";

const router = express.Router();

// APPLY FOR A SCHEME (schemeId = MongoDB _id)
router.post(
    "/apply/:schemeId",
    authBeneficiary,
    applyForScheme
);

// GET ALL APPLICATIONS OF LOGGED-IN BENEFICIARY
router.get(
    "/my-applications",
    authBeneficiary,
    getMyApplications
);

export default router;
