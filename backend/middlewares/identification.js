const jwt=require('jsonwebtoken');
require('dotenv').config();
exports.identifier = (req, res, next) => {
    let token;

    if (req.headers.client === "not-browser") {
        token = req.headers.authorization;
    } else {
        token = req.cookies['Authorization'];
    }

    if (!token) {
        return res.status(401).json({ status: false, message: 'Unauthorized - No token provided' });
    }

    try {
        const userToken = token.split(' ')[1]; // Make sure it's in the format "Bearer <token>"
        const jwtVerified = jwt.verify(userToken, process.env.TOKEN_SECRET);

        if (jwtVerified) {
            req.user = jwtVerified;
            next();
        } else {
            throw new Error('Token verification failed');
        }
    } catch (error) {
        return res.status(403).json({ status: false, message: 'Invalid or expired token', error: error.message });
    }
};
