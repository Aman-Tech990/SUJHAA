import express from "express";
import { createBeneficiary, uploadDocument } from "../controllers/beneficiary.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/",
    auth,
    allowRoles("Beneficiary", "FieldOfficer", "DistrictOfficer", "StateOfficer", "CentralAdmin"),
    createBeneficiary);
router.post("/:id/upload",
    auth,
    allowRoles("FieldOfficer", "DistrictOfficer", "StateOfficer", "CentralAdmin"),
    upload.single("file"),
    uploadDocument);

export default router;
