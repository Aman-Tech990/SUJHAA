import express from "express";
import { authBeneficiary } from "../middlewares/authBeneficiary.js";
import upload from "../middlewares/multer.js";
import {
    applyForScheme,
    getMyApplications
} from "../controllers/application.controller.js";

const router = express.Router();


router.post(
    "/apply/:schemeId",
    authBeneficiary,
    upload.fields([
        { name: "domicile", maxCount: 1 },
        { name: "income", maxCount: 1 },
        { name: "caste", maxCount: 1 }
    ]),
    applyForScheme
);

router.get(
    "/my-applications",
    authBeneficiary,
    getMyApplications
);

export default router;
