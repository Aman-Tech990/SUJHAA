import express from "express";
import {
    addScheme,
    getAllSchemes,
    getSchemeById,
    updateScheme,
    deleteScheme
} from "../controllers/scheme.controller.js";

import { auth } from "../middlewares/auth.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", auth, getAllSchemes);
router.get("/:id", auth, getSchemeById);
router.post(
    "/",
    auth,
    allowRoles("CentralAdmin"),
    addScheme
);

router.patch(
    "/:id",
    auth,
    allowRoles("CentralAdmin"),
    updateScheme
);

router.delete(
    "/:id",
    auth,
    allowRoles("CentralAdmin"),
    deleteScheme
);

export default router;
