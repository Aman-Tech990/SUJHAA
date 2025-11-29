import express from "express";
import {
    assignTrainingToBeneficiary,
    addTrainingSession,
    getTrainerDashboard,
    getBeneficiaryTrainingDetails,
} from "../controllers/trainingController.js";

import { authOfficer } from "../middlewares/authOfficer.js";
import { authTrainer } from "../middlewares/authTrainer.js";
import { authBeneficiary } from "../middlewares/authBeneficiary.js";

const router = express.Router();

/**
 * CENTRAL OFFICER:
 * Assign training to application
 */
router.post(
    "/assign",
    authOfficer(["CENTRAL_OFFICER"]),
    assignTrainingToBeneficiary
);

/**
 * TRAINER:
 * Add session (trainer fills attendance/remarks)
 */
router.post(
    "/session",
    authTrainer,
    addTrainingSession
);

/**
 * TRAINER:
 * Dashboard view (assigned beneficiaries + sessions)
 */
router.get(
    "/trainer-dashboard",
    authTrainer,
    getTrainerDashboard
);

/**
 * BENEFICIARY:
 * View training details of their application
 */
router.get(
    "/details/:applicationRefId",
    authBeneficiary,
    getBeneficiaryTrainingDetails
);

export default router;
