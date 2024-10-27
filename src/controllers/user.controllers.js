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

            // Subir la imagen a Cloudinary (si se envió una imagen)
            let imgUrl = null;
            let imgPublicId = null;
            if (req.file) {
                try {
                    const uploadResponse = await new Promise((resolve, reject) => {
                        cloudinary.uploader.upload_stream({ folder: 'usuarios' }, (error, result) => {
                            if (error) {
                                console.error('Error al subir imagen a Cloudinary:', error);
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        }).end(req.file.buffer);
                    });

                    imgUrl = uploadResponse.secure_url;
                    imgPublicId = uploadResponse.public_id; // Asegúrate de que `public_id` se extrae correctamente
                    console.log("Public ID:", imgPublicId); // Agregar log para verificar el valor
                } catch (error) {
                    return res.status(500).json({ error: `Error al subir imagen a Cloudinary: ${error.message || error}` });
                }
            }

            // Crear el registro del usuario en la base de datos con `img` y `img_public_id`
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
                    img: imgUrl || 'default-image-url',      // Usa una URL predeterminada si no hay imagen
                    img_public_id: imgPublicId || null,       // Guarda el public_id de la imagen o null si no hay imagen
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

        const { veterinarieName, street, email, phone, password, role, city, locality, cologne, number_int, cp, rfc, category } = req.body;
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

            // Validar la categoría (debe ser un array y cada valor debe estar en el enum `Categories`)
            const validCategories = ["NUTRITION", "RECREATION", "CARE"];
            const categoryArray = Array.isArray(category) ? category : [category]; // Asegura que siempre sea un array

            for (let cat of categoryArray) {
                if (!validCategories.includes(cat)) {
                    return res.status(400).json({ error: `Categoría inválida: ${cat}. Las categorías válidas son: ${validCategories.join(", ")}` });
                }
            }

            // Subir la imagen a Cloudinary (si se envió una imagen)
            let imgUrl = null;
            let imgPublicId = null;
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
                    imgPublicId = uploadResponse.public_id; // Guardar el `public_id` de la imagen
                } catch (error) {
                    return res.status(500).json({ error: `Error al subir imagen a Cloudinary: ${error.message || error}` });
                }
            }

            // Crear el registro de la veterinaria en la base de datos con `img`, `img_public_id`, y `category`
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
                    img_public_id: imgPublicId || null,   // Guarda el `public_id` de la imagen o null si no se sube
                    category: categoryArray               // Guarda el array de categorías
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
    upload(req, res, async function (err) {
        if (err) {
            return res.status(500).json({ error: 'Error al cargar la imagen' });
        }

        try {
            const { id } = req.params;
            const { rfc, password, token, newCategories, removeCategories, ...rest } = req.body;
            const updateData = { ...rest };

            // Validación de contraseña
            if (password) {
                const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[-_!¡?¿:@$!%*?&])[A-Za-z\d-_!¡?¿:@$!%*?&]{8,}$/;
                if (!passwordRegex.test(password)) {
                    return res.status(400).json({
                        error: 'La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, un número y un símbolo especial'
                    });
                }
                const hashedPassword = await bcrypt.hash(password, 10);
                updateData.password = hashedPassword;
            }

            // Manejo de imagen
            if (req.file) {
                const existingUser = await prisma.user.findUnique({
                    where: { id: parseInt(id) },
                    select: { img_public_id: true }
                });

                if (existingUser && existingUser.img_public_id) {
                    await cloudinary.uploader.destroy(existingUser.img_public_id);
                }

                const uploadResponse = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream({ folder: 'usuarios' }, (error, result) => {
                        if (error) {
                            console.error('Error al subir imagen a Cloudinary:', error);
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }).end(req.file.buffer);
                });

                updateData.img = uploadResponse.secure_url;
                updateData.img_public_id = uploadResponse.public_id;
            }

            // Solo manejar `newCategories` y `removeCategories` si se proporciona `rfc` (es una veterinaria)
            if (rfc !== undefined && rfc !== "") {
                let categoriesToRemove = [];
                let categoriesToAdd = [];
                const validCategories = ["NUTRITION", "RECREATION", "CARE"];

                if (removeCategories) {
                    categoriesToRemove = typeof removeCategories === 'string' ? [removeCategories] : removeCategories;
                    categoriesToRemove = categoriesToRemove.filter(cat => validCategories.includes(cat));
                }

                if (newCategories) {
                    categoriesToAdd = typeof newCategories === 'string' ? [newCategories] : newCategories;
                    categoriesToAdd = categoriesToAdd.filter(cat => validCategories.includes(cat));
                }

                // Obtener las categorías actuales de la veterinaria
                const existingData = await prisma.veterinary.findUnique({
                    where: { id: parseInt(id) },
                    select: { category: true }
                });

                if (existingData) {
                    // Crear la lista actualizada de categorías
                    const updatedCategories = [
                        ...existingData.category.filter(cat => !categoriesToRemove.includes(cat)),
                        ...categoriesToAdd.filter(cat => !existingData.category.includes(cat))
                    ];
                    updateData.category = updatedCategories;
                }
            }

            // Actualizar el usuario o veterinaria en la base de datos
            if (rfc === undefined || rfc === "") {
                // Actualiza el usuario si no se proporciona RFC
                await prisma.user.update({
                    where: { id: parseInt(id) },
                    data: updateData
                });
            } else {
                // Actualiza la veterinaria si se proporciona RFC
                await prisma.veterinary.update({
                    where: { id: parseInt(id) },
                    data: updateData
                });
            }

            res.json("Usuario o veterinaria actualizado correctamente");
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Error al actualizar el usuario o la veterinaria' });
        }
    });
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