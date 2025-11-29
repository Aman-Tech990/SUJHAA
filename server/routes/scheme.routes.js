import express from "express";
import { getAllSchemes } from "../controllers/scheme.controllers.js";

const router = express.Router();

router.get("/all", getAllSchemes);

export default router;
