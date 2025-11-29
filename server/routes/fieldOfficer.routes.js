import express from "express";
import upload from "../middlewares/multer.js";
import { authOfficer } from "../middlewares/authOfficer.js";
import {
    getApplicationsForDistrict,
    getSingleApplication,
    verifyBeneficiary
} from "../controllers/fieldOfficer.controller.js";

const router = express.Router();


/* --------------------------------------------------
   1. GET ALL APPLICATIONS OF SAME DISTRICT
-------------------------------------------------- */
router.get(
    "/applications",
    authOfficer(["FIELD_OFFICER"]),
    getApplicationsForDistrict
);


/* --------------------------------------------------
   2. GET SINGLE APPLICATION DETAILS
-------------------------------------------------- */
router.get(
    "/application/:application_id",
    authOfficer(["FIELD_OFFICER"]),
    getSingleApplication
);


/* --------------------------------------------------
   3. FIELD VERIFICATION (GPS + PHOTOS)
-------------------------------------------------- */
router.post(
    "/verify",
    authOfficer(["FIELD_OFFICER"]),
    upload.fields([
        { name: "beneficiaryPhoto", maxCount: 1 },
        { name: "housePhoto", maxCount: 1 }
    ]),
    verifyBeneficiary
);


export default router;
