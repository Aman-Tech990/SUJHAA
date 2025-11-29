import express from "express";
import upload from "../middlewares/multer.js";
import { extractAadhaarWithTesseract } from "../services/ocrService.js";

const router = express.Router();

router.post("/aadhaar", upload.single("aadhaar"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const result = await extractAadhaarWithTesseract(req.file.buffer);

        res.json(result);

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
