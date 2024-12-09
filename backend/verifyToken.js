const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_KEY; // Usa la misma clave secreta

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to authenticate token' });
        }

        req.userId = decoded.userId;
        next();
    });
};

module.exports = verifyToken;
