import jwt from 'jsonwebtoken';

const generateToken = (judgeId) => {
    return jwt.sign(
        { id: judgeId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" } // token valid for 7 days
    );
};

export default generateToken;
