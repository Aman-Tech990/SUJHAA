import { Scheme } from "../models/schemes.model.js";

export const addScheme = async (req, res) => {
    try {
        const scheme = await Scheme.create(req.body);
        res.json({
            success: true,
            message: "Scheme added successfully",
            scheme
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getAllSchemes = async (req, res) => {
    try {
        const schemes = await Scheme.find();
        res.json({ success: true, schemes });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getSchemeById = async (req, res) => {
    try {
        const scheme = await Scheme.findById(req.params.id);
        res.json({ success: true, scheme });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateScheme = async (req, res) => {
    try {
        const scheme = await Scheme.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json({
            success: true,
            message: "Scheme updated successfully",
            scheme
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


export const deleteScheme = async (req, res) => {
    try {
        await Scheme.findByIdAndDelete(req.params.id);
        res.json({
            success: true,
            message: "Scheme deleted successfully"
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
