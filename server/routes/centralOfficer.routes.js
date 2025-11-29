import express from "express";

import {
    getStateApprovedApplications,
    centralFinalApprove,
    centralFinalReject,
    releaseInstallment,
    markEnterpriseKitDistributed,
    getCentralMISReport,
    downloadCentralMISPDF
} from "../controllers/centralOfficer.controller.js";

import { assignTrainingToBeneficiary } from "../controllers/trainingController.js";
import { authOfficer } from "../middlewares/authOfficer.js";

const router = express.Router();

// Only Central Admin (ADMIN-001) can access
const ONLY_CENTRAL = authOfficer(["CENTRAL_ADMIN"]);

/**
 * GET ALL STATE APPROVED APPLICATIONS
 */
router.get(
    "/state-approved",
    ONLY_CENTRAL,
    getStateApprovedApplications
);

/**
 * CENTRAL FINAL APPROVAL
 */
router.post(
    "/final-approve",
    ONLY_CENTRAL,
    centralFinalApprove
);

/**
 * CENTRAL FINAL REJECTION
 */
router.post(
    "/final-reject",
    ONLY_CENTRAL,
    centralFinalReject
);

/**
 * ASSIGN TRAINING (CENTRAL ADMIN)
 */
router.post(
    "/assign-training",
    ONLY_CENTRAL,
    assignTrainingToBeneficiary
);

/**
 * RELEASE FUND INSTALLMENT
 */
router.post(
    "/release-installment",
    ONLY_CENTRAL,
    releaseInstallment
);

/**
 * MARK ENTERPRISE KIT DISTRIBUTED
 */
router.post(
    "/kit-distribution",
    ONLY_CENTRAL,
    markEnterpriseKitDistributed
);

/**
 * CENTRAL MIS REPORT
 */
router.get(
    "/mis-report",
    ONLY_CENTRAL,
    getCentralMISReport
);

/* 
    CENTRAL MIS PDF
*/
router.get("/mis-report/pdf", ONLY_CENTRAL, downloadCentralMISPDF);


export default router;

