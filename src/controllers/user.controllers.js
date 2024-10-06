const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updateUser = async (req, res) => {
    try {
        res.send("Hola");
    } catch (e) {
        console.error(e);
    }
};

const createUser = async (req, res) => {
    const { firstName, lastName, email, phone, password, role } = req.body;
    try {
        const newUser = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                password,
                role
            }
        });
        res.json("Usuario creado correctamente");
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
};

const listUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }


};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({
            where: { id: parseInt(id) },
        });
        res.json("Usuario borrado correctamente");
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error al borrar usuario' });
    }

};
module.exports = { updateUser, createUser, listUsers, deleteUser };