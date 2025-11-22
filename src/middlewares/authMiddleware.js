import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "No token. Unauthorized." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.judgeId = decoded.id;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
