import jwt from "jsonwebtoken";
import Officer from "../models/Officer.js";  // Officer model should have "officerId" & "role"

// Middleware to authenticate and authorize officers
export const authOfficer = (allowedRoles = []) => {
    return async (req, res, next) => {
        try {
            const token = req.cookies.token;  // Assuming token is stored in cookies

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "Not authenticated"
                });
            }

            // Decode the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the officer in the database
            const officer = await Officer.findOne({ officerId: decoded.digitalId });

            if (!officer) {
                return res.status(404).json({
                    success: false,
                    message: "Officer not found"
                });
            }

            // Check if officer's role is allowed to access the route
            if (allowedRoles.length && !allowedRoles.includes(officer.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied"
                });
            }

            // Attach officer details to the request
            req.user = officer;
            next();
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }
    };
};
