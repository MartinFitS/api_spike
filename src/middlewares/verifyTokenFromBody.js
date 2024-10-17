    // src/middlewares/verifyTokenFromBody.js

    const jwt = require('jsonwebtoken');

    require('dotenv').config();

    const verifyTokenFromBody = (req, res, next) => {
        const { token } = req.body;

        if (!token) {
            return res.status(403).json({ message: 'Token requerido' });
        }

        if (!process.env.SECRET) {
            return res.status(500).json({ message: 'Secreto no configurado' });
        }
        

        try {

            const decoded = jwt.verify(token, process.env.SECRET);
            
            req.user = decoded;
            
            next();
        } catch (e) {
            return res.status(401).json({ message: 'Token inválido o expirado' });
        }
    };

    module.exports = verifyTokenFromBody;
