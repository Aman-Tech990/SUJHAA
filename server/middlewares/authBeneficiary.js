import jwt from "jsonwebtoken";

export const authBeneficiary = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "BENEFICIARY") {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        req.user = decoded; // we get digitalId, district, state, role
        next();

    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};
