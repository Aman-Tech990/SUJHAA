// routes/district.routes.js
import express from "express";
import { authOfficer } from "../middlewares/authOfficer.js";
import {
    getDistrictApplications,
    getApplicationDetails,
    approveApplication,
    rejectApplication,
    downloadApprovedPDF,
} from "../controllers/district.controller.js";

const router = express.Router();

// All only for DISTRICT_OFFICER
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

export default router;
