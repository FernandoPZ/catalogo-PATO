const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            return next();
        } catch (error) {
            console.error('Error de token:', error);
            return res.status(401).json({ msg: 'No autorizado, token fallido o expirado.' });
        }
    }
    if (!token) {
        return res.status(401).json({ msg: 'No autorizado, no se encontró token.' });
    }
};

module.exports = { protect };