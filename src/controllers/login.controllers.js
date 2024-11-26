const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userFromUsers = await prisma.user.findUnique({
            where: { email }
        });

        const userFromVeterinary = await prisma.veterinary.findUnique({
            where: { email },
            include: {
                availableHours: true,  
                appointments: true     
            }
        });

        const user = userFromUsers || userFromVeterinary;

        if (!user) {
            return res.status(404).json({ message: 'Email no encontrado' });
        }

        if (userFromUsers && userFromUsers.isActive === false) {
            return res.status(403).json({ message: 'The account is not verified.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Wrong password.' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email }, 
            process.env.SECRET
        );

        if (userFromVeterinary) {
            const hours = user.availableHours.map(entry => entry.hour).sort();
            const days = [...new Set(user.availableHours.map(entry => entry.day))];

            user.hora_ini = hours[0];           
            user.hora_fin = hours[hours.length - 1];
            user.dias = days;

            delete user.availableHours;
        }

        res.status(200).json({ user, token });

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};





module.exports = {login}