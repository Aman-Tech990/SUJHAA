import express from "express";
import {
    getStateApplications,
    getStateApplicationDetails,
    stateApprove,
    stateReject,
    downloadStateMISPDF
} from "../controllers/state.controller.js";

import { authOfficer } from "../middlewares/authOfficer.js";

const router = express.Router();

// Only STATE_OFFICER can access these
router.get("/applications", authOfficer(["STATE_OFFICER"]), getStateApplications);

router.get("/applications/:refId", authOfficer(["STATE_OFFICER"]), getStateApplicationDetails);

router.post("/applications/:refId/approve", authOfficer(["STATE_OFFICER"]), stateApprove);

router.post("/applications/:refId/reject", authOfficer(["STATE_OFFICER"]), stateReject);

router.get("/mis/download", authOfficer(["STATE_OFFICER"]), downloadStateMISPDF);

export default router;
