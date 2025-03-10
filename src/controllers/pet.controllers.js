// src/controllers/pet.controller.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cloudinary = require('../utils/cloudinary');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage }).single('img'); 

const createPet = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(500).json({ error: 'Error al cargar la imagen' });
        }
  
        const { ownerId, name, gender, weight, height, animal, age } = req.body;
  
        try {
            // Convertir ownerId y age a números
            const parsedOwnerId = parseInt(ownerId, 10);
            const parsedAge = parseInt(age, 10);

            // Validar que ownerId y age son números válidos
            console.log(parsedOwnerId)

            if (isNaN(parsedOwnerId)) {
                return res.status(400).json({ error: 'ownerId debe ser un número' });
            }
            if (isNaN(parsedAge)) {
                return res.status(400).json({ error: 'age debe ser un número' });
            }
  
            // Verificar que el propietario exista
            const ownerExists = await prisma.user.findUnique({
                where: { id: parsedOwnerId }
            });
  
            if (!ownerExists) {
                return res.status(404).json({ error: "Owner not found" });
            }
  
            // Subir la imagen a Cloudinary (si se envió una imagen)
            let imgUrl = null;
            let imgPublicId = null;
            if (req.file) {
                try {
                    const uploadResponse = await new Promise((resolve, reject) => {
                        cloudinary.uploader.upload_stream({ folder: 'mascotas' }, (error, result) => {
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
  
            // Crear la nueva mascota y asociarla al propietario existente
            const newPet = await prisma.pet.create({
                data: {
                    ownerId: parsedOwnerId,
                    name,
                    gender,
                    weight: parseFloat(weight),
                    height,
                    animal,
                    age: parsedAge,
                    img: imgUrl || 'default-image-url',
                    img_public_id: imgPublicId || null,
                }
            });
  
            res.status(201).json({ message: "Pet successfully created.", newPet });
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: "An error occurred while creating the pet" });
        }
    });
};

const getPets = async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10); 
  
      const ownerExists = await prisma.user.findUnique({
        where: { id }
      });
  
      if (!ownerExists) {
        return res.status(404).json({ error: "Owner not found" });
      }

      const pets = await prisma.pet.findMany({
        where: { ownerId: id }
      });
  
      res.status(200).json(pets);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "An error occurred while fetching pets" });
    }
  };


const getPet = async(req,res) => {
    try{
        const id = parseInt(req.params.id, 10); 

        const pet = await prisma.pet.findUnique({
            where: { id: id }
          });

        if(!pet){
            res.status(404).send("pet not found")
        }
      
          res.status(200).json(pet);
    }catch(e){
        console.error(e)
    }
} 

const updatePet = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(500).json({ error: 'Error al cargar la imagen' });
        }

        const { id } = req.params;
        const { weight, height, name } = req.body;

        try {
            const pet = await prisma.pet.findUnique({
                where: { id: parseInt(id) }
            });

            if (!pet) {
                return res.status(404).json({ error: "Pet not found" });
            }

            const createdAt = new Date(pet.createdAt);
            const currentDate = new Date();
            
            const monthsSinceCreation = (currentDate.getFullYear() - createdAt.getFullYear()) * 12 + (currentDate.getMonth() - createdAt.getMonth());

            const initialAge = pet.age || 0; 
            const totalAgeInMonths = isNaN(monthsSinceCreation) ? initialAge : initialAge + monthsSinceCreation;

            let updateData = {
                name: name,
                weight: parseFloat(weight) || pet.weight,      
                height: height ? String(height) : pet.height,  
                age: totalAgeInMonths                         
            };

            if (req.file) {
                if (pet.img_public_id) {
                    await cloudinary.uploader.destroy(pet.img_public_id);
                }

                const uploadResponse = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream({ folder: 'mascotas' }, (error, result) => {
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

            const updatedPet = await prisma.pet.update({
                where: { id: parseInt(id) },
                data: updateData
            });

            res.status(200).json({ message: "Pet updated successfully.", updatedPet });
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: "Error al actualizar la mascota" });
        }
    });
};


const deathPet = async(req,res) => {
    try{
        const { petId, dateOfDeath } = req.body;

        const pet = await prisma.pet.findUnique({
            where: { id: petId },
        });

        if (!pet) {
            return res.status(404).json({ error: "La mascota no existe" });
        }

        await prisma.appointment.deleteMany({
            where: { petId },
        });

        await prisma.deceasedPet.create({
            data: {
                originalId: pet.id,
                ownerId: pet.ownerId,
                name: pet.name,
                gender: pet.gender,
                weight: pet.weight,
                height: pet.height,
                animal: pet.animal,
                age: pet.age,
                img: pet.img,
                img_public_id: pet.img_public_id,
                dateOfDeath, 
            },
        });

        await prisma.pet.delete({
            where: { id: petId },
        });

        res.status(200).json({ message: "Mascota movida a la tabla de fallecidas" });
    }catch(e){
        console.error(e)
    }
}

const deathPetsById = async (req, res) => {
    try {
        const { id } = req.params;

        const idNumber = parseInt(id,10)

        if (!idNumber) {
            return res.status(400).json({ message: "El ID del usuario es requerido" });
        }

        const deceasedPets = await prisma.deceasedPet.findMany({
            where: {
                ownerId: idNumber, 
            },
        });

        if (deceasedPets.length === 0) {
            return res.status(404).json({ message: "No se encontraron mascotas fallecidas para este usuario" });
        }

        res.status(200).json(deceasedPets);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Error al obtener las mascotas fallecidas" });
    }
};



module.exports = {createPet,getPets,getPet,updatePet,deathPet,deathPetsById}