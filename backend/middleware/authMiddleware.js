import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function authenticateToken(req, res, next) {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({error: "Access denied. No token provided."});
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

        if (err) {
            return res.status(403).json({error: "Token expired or invalid."});
        }

        req.user = user;
        next();
    });
}

export default authenticateToken;