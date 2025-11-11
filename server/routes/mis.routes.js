import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { getMISReport } from "../controllers/mis.controller.js";
import { downloadMISPDF } from "../controllers/mis.controller.js";

const router = express.Router();

router.get(
    "/",
    auth,
    allowRoles("DistrictOfficer", "StateOfficer", "CentralAdmin"),
    getMISReport
);

router.get(
    "/pdf",
    auth,
    allowRoles("DistrictOfficer", "StateOfficer", "CentralAdmin"),
    downloadMISPDF
);


export default router;
