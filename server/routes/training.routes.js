import express from "express";
import {
    getCentralApprovedForDistrict,
    assignTrainingToBeneficiary,
    addTrainingSession,
    getTrainerDashboard,
    getBeneficiaryTrainingDetails,
} from "../controllers/trainingController.js";

import { authOfficer } from "../middlewares/authOfficer.js";
import { authTrainer } from "../middlewares/authTrainer.js";
import { authBeneficiary } from "../middlewares/authBeneficiary.js";

const router = express.Router();

/* ---------------------------------------------------
   DISTRICT: FETCH CENTRAL APPROVED APPLICATIONS
--------------------------------------------------- */
router.get(
    "/district/central-approved",
    authOfficer(["DISTRICT_OFFICER"]),
    getCentralApprovedForDistrict
);

/* ---------------------------------------------------
   DISTRICT: ASSIGN TRAINING
--------------------------------------------------- */
router.post(
    "/district/assign-training",
    authOfficer(["DISTRICT_OFFICER"]),
    assignTrainingToBeneficiary
);

/* ---------------------------------------------------
   TRAINER: ADD TRAINING SESSION
--------------------------------------------------- */
router.post(
    "/trainer/add-session",
    authTrainer,
    addTrainingSession
);

/* ---------------------------------------------------
   TRAINER: DASHBOARD (assigned apps + sessions)
--------------------------------------------------- */
router.get(
    "/trainer/dashboard",
    authTrainer,
    getTrainerDashboard
);

/* ---------------------------------------------------
   BENEFICIARY: VIEW THEIR TRAINING DETAILS
--------------------------------------------------- */
router.get(
    "/beneficiary/details/:applicationRefId",
    getBeneficiaryTrainingDetails
);

export default router;
