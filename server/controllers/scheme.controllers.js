import Scheme from "../models/Scheme.js";

export const getAllSchemes = async (req, res) => {
    try {
        const schemes = await Scheme.find({ status: "ACTIVE" }).sort({ schemeId: 1 });

        return res.json({
            success: true,
            schemes
        });
    } catch (err) {
        console.error("SCHEME FETCH ERROR:", err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
