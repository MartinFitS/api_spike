const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cloudinary = require('../utils/cloudinary'); // Asegúrate de importar la configuración de Cloudinary
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage }).single('img'); // Procesar la imagen como 'img'

const createPet = async (req, res) => {
  upload(req, res, async function (err) {
      if (err) {
          return res.status(500).json({ error: 'Error al cargar la imagen' });
      }

      const { id_owner, name, gender, weight, height, animal } = req.body;

      try {
          // Convertir `id_owner` a número
          const ownerId = parseInt(id_owner, 10);
          if (isNaN(ownerId)) {
              return res.status(400).json({ error: 'id_owner debe ser un número' });
          }

          // Verifica que el dueño de la mascota existe
          const ownerExists = await prisma.user.findUnique({
              where: { id: ownerId }
          });

          if (!ownerExists) {
              return res.status(404).json({ error: "Owner not found" });
          }

          // Subir la imagen a Cloudinary (si se envió una imagen)
          let imgUrl = null;
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
              } catch (error) {
                  return res.status(500).json({ error: `Error al subir imagen a Cloudinary: ${error.message || error}` });
              }
          }

          // Crear el registro de la mascota en la base de datos
          const newPet = await prisma.pet.create({
              data: {
                  id_owner,
                  name,
                  gender,
                  weight: parseFloat(weight), // Asegura que el peso se interprete como número
                  height, // Asegura que la altura se interprete como número
                  animal,
                  img: imgUrl || 'default-image-url', // Usa una URL predeterminada si no se sube una imagen
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
module.exports = {createPet,getPets,getPet}