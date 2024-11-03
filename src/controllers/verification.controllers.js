const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const verifyEmail = async (req, res) => {
    const { user } = req;

    try {
        await prisma.user.update({
            where: { id: user.userId },
            data: { isActive: true }
        });

        res.status(200).json({ message: 'Correo verificado correctamente. Tu cuenta está ahora activa.' });
        console.log('Correo verificado correctamente. Tu cuenta está ahora activa.');
    } catch (e) {
        console.error(e);
        res.status(400).json({ error: 'Error al verificar el correo.' });
        console.log('Error al verificar el correo.');
    }
};

const deleteUser = async (req, res) => {
    const { user } = req;

    try {
        await prisma.user.delete({
            where: { id: user.userId }
        });

        res.status(200).json({ message: 'Cuenta eliminada correctamente.' });
        console.log('Cuenta eliminada correctamente.');
    } catch (e) {
        console.error(e);
        res.status(400).json({ error: 'Error al eliminar la cuenta.' });
        console.log('Error al eliminar la cuenta.');
    }
};

module.exports = { verifyEmail, deleteUser };