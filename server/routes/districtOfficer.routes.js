import express from "express";
import { authOfficer } from "../middlewares/authOfficer.js";

import {
    getDistrictApplications,
    getApplicationDetails,
    approveApplication,
    rejectApplication,
    downloadApprovedPDF,
} from "../controllers/district.controller.js";

import {
    getCentralApprovedForDistrict,
    assignTrainingToBeneficiary
} from "../controllers/trainingController.js";

const router = express.Router();

/* -------------------------------------------
   DISTRICT APPROVAL WORKFLOW (UNDER_VERIFICATION)
------------------------------------------- */
router.get(
    "/applications",
    authOfficer(["DISTRICT_OFFICER"]),
    getDistrictApplications
);

router.get(
    "/application/:refId",
    authOfficer(["DISTRICT_OFFICER"]),
    getApplicationDetails
);

router.post(
    "/application/:refId/approve",
    authOfficer(["DISTRICT_OFFICER"]),
    approveApplication
);

router.post(
    "/application/:refId/reject",
    authOfficer(["DISTRICT_OFFICER"]),
    rejectApplication
);

router.get(
    "/approved/pdf",
    authOfficer(["DISTRICT_OFFICER"]),
    downloadApprovedPDF
);

/* -------------------------------------------
   NEW TRAINING WORKFLOW (CENTRAL_APPROVED → TRAINING_ASSIGNED)
------------------------------------------- */
router.get(
    "/training/central-approved",
    authOfficer(["DISTRICT_OFFICER"]),
    getCentralApprovedForDistrict
);

router.post(
    "/training/assign",
    authOfficer(["DISTRICT_OFFICER"]),
    assignTrainingToBeneficiary
);

export default router;
