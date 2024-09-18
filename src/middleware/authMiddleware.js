import { verifyToken } from '../utils/jwtHelper.js'; // Adjust the path as needed

const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded; // Attach user data to request object
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token.' });
    }
};

export default authenticateJWT;
