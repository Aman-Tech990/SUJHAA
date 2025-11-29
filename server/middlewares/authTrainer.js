// middleware/authTrainer.js
import jwt from "jsonwebtoken";
import Trainer from "../models/Trainer.js";

export const authTrainer = () => {
    return async (req, res, next) => {
        try {
            const token =
                req.cookies.token || req.headers.authorization?.split(" ")[1];

            if (!token) {
                return res.status(401).json({ success: false, message: "Not authenticated" });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const trainer = await Trainer.findOne({ trainerId: decoded.trainerId });

            if (!trainer) {
                return res.status(404).json({ success: false, message: "Trainer not found" });
            }

            req.user = trainer;
            next();
        } catch (err) {
            return res.status(401).json({ success: false, message: "Invalid or expired token" });
        }
    };
};
