import jwt from "jsonwebtoken";
import Officer from "../models/Officer.js";

export const authOfficer = (allowedRoles = []) => {
    return async (req, res, next) => {
        try {
            let token = req.cookies.token;  // Web dashboards use cookie

            // Mobile app uses Authorization: Bearer token
            if (!token && req.headers.authorization) {
                token = req.headers.authorization.replace("Bearer ", "");
            }

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "Not authenticated"
                });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Officer identity is in decoded.digitalId
            const officer = await Officer.findOne({ officerId: decoded.digitalId });

            if (!officer) {
                return res.status(404).json({
                    success: false,
                    message: "Officer not found"
                });
            }

            // Check role permissions
            if (allowedRoles.length > 0 && !allowedRoles.includes(officer.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied"
                });
            }

            req.user = {
                id: officer._id,
                officerId: officer.officerId,
                role: officer.role,
                name: officer.name,
                district: officer.district,
                state: officer.state
            };

            next();

        } catch (err) {
            console.error("AUTH OFFICER ERROR:", err);
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }
    };
};
