import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const protect = async (req, res, next) => {
    try {
        let token;

        // Accept BOTH:
        // Authorization: Bearer <token>
        // Or
        // Authorization: <token>
        if (req.headers.authorization) {
            if (req.headers.authorization.startsWith("Bearer")) {
                token = req.headers.authorization.split(" ")[1];
            } else {
                token = req.headers.authorization; // raw token
            }
        }

        if (!token) {
            return res
                .status(401)
                .json({ success: false, message: "Not authorized, token missing" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find admin in DB
        const admin = await Admin.findById(decoded.id).select("-password");

        if (!admin) {
            return res
                .status(401)
                .json({ success: false, message: "Admin not found or unauthorized" });
        }

        req.admin = admin; // attach admin data to request
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        res
            .status(401)
            .json({ success: false, message: "Invalid or expired token" });
    }
};
