const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar en las tablas `user` y `veterinary`
        const userFromUsers = await prisma.user.findUnique({
            where: { email }
        });

        const userFromVeterinary = await prisma.veterinary.findUnique({
            where: { email }
        });

        const user = userFromUsers || userFromVeterinary;

        // Si el usuario no se encuentra
        if (!user) {
            return res.status(404).json({ message: 'Email no encontrado' });
        }

        // Verificar si la cuenta está activa solo para usuarios en `User`
        if (userFromUsers && userFromUsers.isActive === false) {
            return res.status(403).json({ message: 'La cuenta no está verificada' });
        }

        // Verificar la contraseña
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Generar el token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email }, 
            process.env.SECRET, 
            { expiresIn: '1h' } 
        );

        res.status(200).json({ user, token });

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};


module.exports = {login}