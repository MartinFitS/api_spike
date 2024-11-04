const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const verifyEmail = async (req, res) => {
    const { user } = req;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { id: user.userId },
        });

        if (!existingUser) {
            return res.status(404).render('error', { message: 'Usuario no encontrado.' });
        }

        await prisma.user.update({
            where: { id: user.userId },
            data: { isActive: true },
        });

        res.status(200).render('verifyEmail');
    } catch (e) {
        console.error(e);
        res.status(400).render('error', { message: 'Error al verificar el correo.' });
    }
};

const deleteUser = async (req, res) => {
    const { user } = req;

    try {
        await prisma.user.delete({
            where: { id: user.userId }
        });

        res.status(200).render('deleteUser');
    } catch (e) {
        console.error(e);
        res.status(400).render('error', { message: 'Error al eliminar la cuenta.' });
    }
};


module.exports = { verifyEmail, deleteUser };