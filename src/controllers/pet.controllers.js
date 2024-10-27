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
  
        const { id_owner, name, gender, weight, height, animal, age } = req.body;
  
        try {
            const ownerId = parseInt(id_owner, 10);
            const ageNumber = parseInt(age, 10)
            if (isNaN(ownerId)) {
                return res.status(400).json({ error: 'id_owner debe ser un número' });
            }
  
            const ownerExists = await prisma.user.findUnique({
                where: { id: ownerId }
            });
  
            if (!ownerExists) {
                return res.status(404).json({ error: "Owner not found" });
            }
  
            let imgUrl = null;
            let imgPublicId = null;
            if (req.file) {
                try {
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
                    imgUrl = uploadResponse.secure_url;
                    imgPublicId = uploadResponse.public_id; 
                } catch (error) {
                    return res.status(500).json({ error: `Error al subir imagen a Cloudinary: ${error.message || error}` });
                }
            }
  
            const newPet = await prisma.pet.create({
                data: {
                    id_owner,
                    name,
                    gender,
                    weight: parseFloat(weight),
                    height, 
                    animal,
                    age: ageNumber,
                    img: imgUrl || 'default-image-url', 
                    img_public_id: imgPublicId || null, 
                }
            });
  
            res.status(201).json({ message: "Mascota creada correctamente", newPet });
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
        where: { id_owner: id }
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
        const { weight, height } = req.body;

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

            res.status(200).json({ message: "Mascota actualizada correctamente", updatedPet });
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: "Error al actualizar la mascota" });
        }
    });
};



module.exports = {createPet,getPets,getPet,updatePet}