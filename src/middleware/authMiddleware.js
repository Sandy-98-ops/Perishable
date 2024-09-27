import { setCurrentUser } from '../utils/context.js';
import { verifyToken } from '../utils/jwtHelper.js';

const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded; // Attach user data to request object
        setCurrentUser(decoded); // Set user context
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token.' });
    }
};

export default authenticateJWT;
