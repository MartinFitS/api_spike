const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('img');
const cloudinary = require('../utils/cloudinary'); 
const hunterClient = require('../utils/hunter');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../utils/mailer');

const createUser = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(500).json({ error: 'Error al cargar la imagen' });
        }

        const { firstName, lastName, email, phone, password, role, city, number_int, cp } = req.body;
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+[\]{};':"\\|,.<>/?]{8,}$/;
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
                return res.status(400).json({ error: 'El correo ya está registrado en la bd' });
            }

            try {
                const emailVerification = await hunterClient.verifyEmail(email);
                if (!emailVerification.data || emailVerification.data.status !== 'valid') {
                    return res.status(400).json({ 
                        error: 'Email inválido',
                        details: {
                            message: 'La verificación del email falló',
                            emailChecked: email,
                        }
                    });
                }
            } catch (hunterError) {
                return res.status(500).json({
                    error: 'Error en verificación de email',
                    details: {
                        message: 'Error al verificar el email con Hunter',
                        emailChecked: email,
                    }
                });
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
                    isActive: false
                }
            });

            const token = jwt.sign({ userId: newUser.id }, process.env.SECRET, { expiresIn: '10m' });
            await sendVerificationEmail(email, token);
            res.status(201).json({ message: "Usuario creado correctamente. Por favor verifica tu correo", newUser });

        } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Error al crear usuario', e });
        }
    });
};
// Función para generar el inicio del RFC basado en el nombre de la empresa según las reglas
function generateRFCStart(name) {
    const words = name.trim().split(' ').filter(word => !["de", "y", "la"].includes(word.toLowerCase()));
    let initials = "";

    if (words.length === 1) {
        // Si hay una sola palabra, tomar las tres primeras letras (completando con "X" si es necesario)
        initials = words[0].substring(0, 3).toUpperCase();
        while (initials.length < 3) {
            initials += 'X';
        }
    } else if (words.length === 2) {
        // Si hay dos palabras, tomar la primera letra de la primera palabra y las dos primeras de la segunda
        initials = (words[0][0] + words[1].substring(0, 2)).toUpperCase();
    } else if (words.length === 3) {
        // Si hay tres palabras, tomar la primera letra de cada una
        initials = (words[0][0] + words[1][0] + words[2][0]).toUpperCase();
    } else {
        // Si hay cuatro o más palabras, tomar la primera letra de las primeras cuatro palabras
        initials = (words[0][0] + words[1][0] + words[2][0] + words[3][0]).toUpperCase();
    }

    return initials;
}

const createVeterinary = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(500).json({ error: 'Error al cargar la imagen' });
        }

        const { 
            veterinarieName, street, email, phone, password, role, city, locality, cologne, 
            number_int, cp, rfc, category, horaInicio, horaFin, diasSemana 
        } = req.body;
        
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[-_!¡?¿:@$!%*?&])[A-Za-z\d-_!¡?¿:@$!%*?&]{8,}$/;
        const rfcRegex = /^[A-Z]{3}\d{6}[A-Z0-9]{3}$/;
        const phoneRegex = /^\d{10}$/;
        const validCategories = ["NUTRITION", "RECREATION", "CARE"];
        const validDias = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

        try {
            // Validaciones iniciales
            if (role !== "VETERINARY_OWNER") {
                return res.status(400).json({ error: 'El rol debe ser "VETERINARY_OWNER"' });
            }

            if (!passwordRegex.test(password)) {
                return res.status(400).json({ 
                    error: 'La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, un número y un símbolo especial' 
                });
            }

            // Validación del formato del RFC y su coincidencia con el nombre de la empresa
            const expectedRFCStart = generateRFCStart(veterinarieName);

            if (!rfcRegex.test(rfc) || rfc.substring(0, 3) !== expectedRFCStart) {
                return res.status(400).json({ 
                    error: `El RFC no es válido. Debe empezar con "${expectedRFCStart}" y seguir el formato correcto para una persona moral.` 
                });
            }

            if (!phoneRegex.test(phone)) {
                return res.status(400).json({ error: 'El número telefónico debe tener 10 dígitos.' });
            }

            const emailExists = await prisma.veterinary.findUnique({
                where: { email }
            });

            if (emailExists) {
                return res.status(400).json({ error: 'El correo ya está registrado en la bd' });
            }

            try {
                const emailVerification = await hunterClient.verifyEmail(email);
                if (!emailVerification.data || emailVerification.data.status !== 'valid') {
                    return res.status(400).json({ 
                        error: 'Email inválido',
                        details: {
                            message: 'La verificación del email falló',
                            emailChecked: email,
                        }
                    });
                }
            } catch (hunterError) {
                return res.status(500).json({
                    error: 'Error en verificación de email',
                    details: {
                        message: 'Error al verificar el email con Hunter',
                        emailChecked: email,
                    }
                });
            }

            const phoneExists = await prisma.veterinary.findFirst({
                where: { phone }
            });

            if (phoneExists) {
                return res.status(400).json({ error: 'El número telefónico ya está en uso' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const categoryArray = Array.isArray(category) ? category : [category];
            for (let cat of categoryArray) {
                if (!validCategories.includes(cat)) {
                    return res.status(400).json({ error: `Categoría inválida: ${cat}. Las categorías válidas son: ${validCategories.join(", ")}` });
                }
            }

            const horaInicioNum = parseInt(horaInicio, 10);
            const horaFinNum = parseInt(horaFin, 10);
            if (
                isNaN(horaInicioNum) || 
                isNaN(horaFinNum) || 
                horaInicioNum < 0 || 
                horaFinNum > 23 || 
                horaInicioNum >= horaFinNum
            ) {
                return res.status(400).json({ error: 'Horas de inicio o fin inválidas. Deben estar entre 0 y 23, y la hora de inicio debe ser menor que la hora de fin.' });
            }

            const diasArray = Array.isArray(diasSemana) ? diasSemana : [diasSemana];
            for (let dia of diasArray) {
                if (!validDias.includes(dia)) {
                    return res.status(400).json({ error: `Día inválido: ${dia}. Los días válidos son: ${validDias.join(", ")}` });
                }
            }

            let imgUrl = null;
            let imgPublicId = null;
            if (req.file) {
                try {
                    const uploadResponse = await new Promise((resolve, reject) => {
                        cloudinary.uploader.upload_stream({ folder: 'veterinarias' }, (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }).end(req.file.buffer);
                    });
                    imgUrl = uploadResponse.secure_url;
                    imgPublicId = uploadResponse.public_id;
                } catch (error) {
                    return res.status(500).json({ error: `Error al subir imagen a Cloudinary: ${error.message || error}` });
                }
            }

            // Crear el registro de la veterinaria en la base de datos
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
                    img: imgUrl || 'default-image-url',
                    img_public_id: imgPublicId || null,
                    category: categoryArray
                }
            });

            // Generar horarios disponibles basados en horaInicio y horaFin del cuerpo de la solicitud y los días especificados
            const horarios = [];
            
            for (const dia of diasArray) {
                for (let hora = horaInicioNum; hora < horaFinNum; hora++) {
                    const horaFormato = `${hora.toString().padStart(2, '0')}:00`;
                    horarios.push({
                        hour: horaFormato,
                        day: dia,
                        veterinaryId: newVeterinarie.id
                    });
                }
            }

            // Guardar los horarios en la base de datos
            await prisma.availableHour.createMany({
                data: horarios
            });

            res.status(201).json({ message: "Veterinaria creada correctamente con horarios disponibles", newVeterinarie });

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

const updateVeterinary = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(500).json({ error: 'Error al cargar la imagen' });
        }

        const { id } = req.params;
        const { 
            rfc, password, token, newCategories, removeCategories, 
            newAvailableHours, removeAvailableHours, horaInicio, horaFin, diasSemana, ...rest 
        } = req.body;

        const updateData = { ...rest };

        try {
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
                const existingUser = await prisma.veterinary.findUnique({
                    where: { id: parseInt(id) },
                    select: { img_public_id: true }
                });

                if (existingUser && existingUser.img_public_id) {
                    await cloudinary.uploader.destroy(existingUser.img_public_id);
                }

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

                updateData.img = uploadResponse.secure_url;
                updateData.img_public_id = uploadResponse.public_id;
            }

            // Manejo de categorías (agregar o eliminar)
            if (newCategories || removeCategories) {
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

                const existingData = await prisma.veterinary.findUnique({
                    where: { id: parseInt(id) },
                    select: { category: true }
                });

                if (existingData) {
                    const updatedCategories = [
                        ...existingData.category.filter(cat => !categoriesToRemove.includes(cat)),
                        ...categoriesToAdd.filter(cat => !existingData.category.includes(cat))
                    ];
                    updateData.category = updatedCategories;
                }
            }

            // Validación y actualización de horarios
            if (horaInicio || horaFin || diasSemana) {
                // Verificar si existen citas pendientes
                const pendingAppointments = await prisma.appointment.findMany({
                    where: {
                        veterinaryId: parseInt(id),
                        done: false
                    }
                });

                if (pendingAppointments.length > 0) {
                    return res.status(400).json({
                        error: 'No se pueden modificar los horarios porque hay citas pendientes.'
                    });
                }

                // Eliminar horarios antiguos
                await prisma.availableHour.deleteMany({
                    where: { veterinaryId: parseInt(id) }
                });

                // Crear nuevos horarios si se especifican `horaInicio`, `horaFin`, y `diasSemana`
                if (horaInicio && horaFin && diasSemana) {
                    const horaInicioNum = parseInt(horaInicio, 10);
                    const horaFinNum = parseInt(horaFin, 10);
                    const diasArray = Array.isArray(diasSemana) ? diasSemana : [diasSemana];

                    const horarios = [];

                    for (const dia of diasArray) {
                        for (let hora = horaInicioNum; hora < horaFinNum; hora++) {
                            const horaFormato = `${hora.toString().padStart(2, '0')}:00`;
                            horarios.push({
                                hour: horaFormato,
                                day: dia,
                                veterinaryId: parseInt(id)
                            });
                        }
                    }

                    await prisma.availableHour.createMany({
                        data: horarios
                    });
                }
            }

            // Actualizar otros datos de la veterinaria
            await prisma.veterinary.update({
                where: { id: parseInt(id) },
                data: updateData
            });

            res.status(200).json({ message: "Veterinaria actualizada correctamente" });
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Error al actualizar la veterinaria' });
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

const getVeterinary = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(id)

        const veterinary = await prisma.veterinary.findUnique({
            where: { id: parseInt(id, 10) },
            include: {
                availableHours: true,  
                appointments: true     
            }
        });

        if (!veterinary) {
            return res.status(404).json({ message: 'Veterinaria no encontrada' });
        }

        const hours = veterinary.availableHours.map(entry => entry.hour).sort();
        const days = [...new Set(veterinary.availableHours.map(entry => entry.day))];

        const hora_ini = hours[0];          
        const hora_fin = hours[hours.length - 1]; 

        const response = {
            ...veterinary,
            hora_ini,
            hora_fin,
            dias: days
        };
        delete response.availableHours;

        res.status(200).json({ veterinary: response });

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = { getVeterinary,updateUser, createUser, listUsers, deleteUser, createVeterinary, listVeterinaries,updateVeterinary };