const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
    const { firstName, lastName, email, phone, password, role, city, number_int, cp } = req.body;

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[-_!¡?¿:@$!%*?&])[A-Za-z\d-_!¡?¿:@$!%*?&]{8,}$/;
    const phoneRegex = /^\d{10}$/;

    try {
        if (role !== "PET_OWNER") {
            return res.status(400).json({ error: 'El rol debe ser "VETERINARY_OWNER"' });
        }

        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ error: 'El número telefónico debe tener 10 dígitos.' });
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                error: 'La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, un número y un símbolo especial' 
            });
        }

        const emailExists = await prisma.user.findUnique({
            where: { email }
        });

        if (emailExists) {
            return res.status(400).json({ error: 'El correo ya está en uso' });
        }

        const phoneExists = await prisma.user.findFirst({
            where: { phone }
        });

        if (phoneExists) {
            return res.status(400).json({ error: 'El número telefónico ya está en uso' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                password: hashedPassword, 
                role, 
                city,
                number_int,
                cp
            }
        });

        res.status(201).json({ message: "Usuario creado correctamente", newUser });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
};

const createVeterinary = async (req, res) => {
    const { veterinarieName, street, email, phone, password, role, city, locality, cologne, number_int, cp, rfc } = req.body;

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[-_!¡?¿:@$!%*?&])[A-Za-z\d-_!¡?¿:@$!%*?&]{8,}$/;
    const rfcRegex = /^[A-Z]{3}\d{6}[A-Z0-9]{3}$/;
    const phoneRegex = /^\d{10}$/;

    try {
        if (role !== "VETERINARY_OWNER") {
            return res.status(400).json({ error: 'El rol debe ser "VETERINARY_OWNER"' });
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                error: 'La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, un número y un símbolo especial' 
            });
        }

        if (!rfcRegex.test(rfc)) {
            return res.status(400).json({ error: 'El RFC no es válido. Debe tener el formato de una persona moral.' });
        }

        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ error: 'El número telefónico debe tener 10 dígitos.' });
        }

        const emailExists = await prisma.veterinary.findUnique({
            where: { email }
        });

        if (emailExists) {
            return res.status(400).json({ error: 'El correo ya está en uso' });
        }

        const phoneExists = await prisma.veterinary.findFirst({
            where: { phone }
        });

        if (phoneExists) {
            return res.status(400).json({ error: 'El número telefónico ya está en uso' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newVeterinarie = await prisma.veterinary.create({
            data: {
                veterinarieName,
                street,
                email,
                phone,
                password: hashedPassword,
                role,
                city,
                locality,
                cologne,
                number_int,
                cp,
                rfc
            }
        });

        res.status(201).json({ message: "Veterinaria creada correctamente", newVeterinarie });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error al crear la veterinaria' });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { rfc, number_int, cp, city, phone, street, email, password, locality, cologne } = req.body;
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[-_!¡?¿:@$!%*?&])[A-Za-z\d-_!¡?¿:@$!%*?&]{8,}$/;
        
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                error: 'La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, un número y un símbolo especial' 
            });
        }

        
        hashedPassword = await bcrypt.hash(password, 10);
        if (rfc == "") {
            await prisma.user.update({
                where: { id: parseInt(id) },
                data: {
                    number_int,
                    cp,
                    city,
                    phone,

                    email,
                    password: hashedPassword || undefined, 
         
          
                }
            });
        } else {
            await prisma.veterinary.update({
                where: { id: parseInt(id) },
                data: {
                    number_int,
                    cp,
                    city,
                    cologne,
                    phone,
                    email,
                    locality,
                    street,
                    password: hashedPassword || undefined 
                }
            });
        }

        res.json("Usuario actualizado correctamente");
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
};


const listUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        const veterinaries = await prisma.veterinary.findMany();

        console.log(users)
        res.json({users, veterinaries});
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    const {rfc} = req.body;
    try {

        if(rfc == ""){
            await prisma.user.delete({
                where: { id: parseInt(id) },
            });
        }else{
            await prisma.veterinary.delete({
                where: { id: parseInt(id) },
            });
        }

        res.json("Usuario borrado correctamente");
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error al borrar usuario' });
    }

};

module.exports = { updateUser, createUser, listUsers, deleteUser,createVeterinary };