const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('img');
const cloudinary = require('../utils/cloudinary'); 

const createUser = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(500).json({ error: 'Error al cargar la imagen' });
        }

        const { firstName, lastName, email, phone, password, role, city, number_int, cp } = req.body;
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[-_!¡?¿:@$!%*?&])[A-Za-z\d-_!¡?¿:@$!%*?&]{8,}$/;
        const phoneRegex = /^\d{10}$/;

        try {
            if (role !== "PET_OWNER" && role !== "ADMIN") {
                return res.status(400).json({ error: 'El rol debe ser "VETERINARY_OWNER" o "ADMIN"' });
            }
            if (!phoneRegex.test(phone)) {
                return res.status(400).json({ error: 'El número telefónico debe tener 10 dígitos.' });
            }
            if (!passwordRegex.test(password)) {
                return res.status(400).json({
                    error: 'La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, un número y un símbolo especial'
                });
            }

            const emailExists = await prisma.user.findUnique({ where: { email } });
            if (emailExists) {
                return res.status(400).json({ error: 'El correo ya está en uso' });
            }

            const phoneExists = await prisma.user.findFirst({ where: { phone } });
            if (phoneExists) {
                return res.status(400).json({ error: 'El número telefónico ya está en uso' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            let imgUrl = null;
            if (req.file) {
                try {
                    const uploadResponse = await new Promise((resolve, reject) => {
                        cloudinary.uploader.upload_stream({ folder: 'usuarios' }, (error, result) => {
                            if (error) {
                                console.error('Error al subir imagen a Cloudinary:', error); // Muestra el error completo
                                reject(error); // Rechaza con el error completo
                            } else {
                                resolve(result);
                            }
                        }).end(req.file.buffer);
                    });
                    imgUrl = uploadResponse.secure_url;
                } catch (error) {
                    return res.status(500).json({ error: `Error al subir imagen a Cloudinary: ${error.message || error}` });
                }
            }

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
                    cp,
                    img: imgUrl || 'default-image-url', // Usa una URL predeterminada si no hay imagen
                }
            });

            res.status(201).json({ message: "Usuario creado correctamente", newUser });

        } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Error al crear usuario' });
        }
    });
};


const createVeterinary = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(500).json({ error: 'Error al cargar la imagen' });
        }

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

            // Subir la imagen a Cloudinary (si se envió una imagen)
            let imgUrl = null;
            if (req.file) {
                try {
                    const uploadResponse = await new Promise((resolve, reject) => {
                        cloudinary.uploader.upload_stream({ folder: 'veterinarias' }, (error, result) => {
                            if (error) {
                                console.error('Error al subir imagen a Cloudinary:', error);
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        }).end(req.file.buffer);
                    });
                    imgUrl = uploadResponse.secure_url;
                } catch (error) {
                    return res.status(500).json({ error: `Error al subir imagen a Cloudinary: ${error.message || error}` });
                }
            }

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
                    rfc,
                    img: imgUrl || 'default-image-url', // Usa una URL predeterminada si no se sube una imagen
                }
            });

            res.status(201).json({ message: "Veterinaria creada correctamente", newVeterinarie });

        } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Error al crear la veterinaria' });
        }
    });
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { rfc, password,token, ...rest } = req.body; // Extraemos el password y el resto de los campos se agrupan en 'rest'
        const updateData = { ...rest }; // Crea un objeto con los campos restantes
        
        // Si se incluye una contraseña, validar y encriptar
        if (password) {
            const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[-_!¡?¿:@$!%*?&])[A-Za-z\d-_!¡?¿:@$!%*?&]{8,}$/;
            if (!passwordRegex.test(password)) {
                return res.status(400).json({
                    error: 'La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, un número y un símbolo especial'
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword; // Solo agregamos la contraseña encriptada si se incluye
        }

        if (rfc === undefined || rfc === "") {
            // Actualiza el usuario si no se proporciona RFC
            await prisma.user.update({
                where: { id: parseInt(id) },
                data: updateData, // Usamos el objeto 'updateData' que tiene solo los campos enviados
            });
        } else {
            // Actualiza la veterinaria si se proporciona RFC
            await prisma.veterinary.update({
                where: { id: parseInt(id) },
                data: updateData, // Usamos el objeto 'updateData' que tiene solo los campos enviados
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

const listVeterinaries = async (req, res) => {
    try {
        const veterinaries = await prisma.veterinary.findMany();
        res.json({ veterinaries });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error al obtener las veterinarias' });
    }
};

module.exports = { updateUser, createUser, listUsers, deleteUser, createVeterinary, listVeterinaries };