
const {Router} = require("express");
const verifyTokenFromBody = require("../middlewares/verifyTokenFromBody");
const {createPet,getPets,getPet,updatePet,deathPet,deathPetsById} = require("../controllers/pet.controllers")

const router = Router();

/**
 * @swagger
 * /createpet:
 *   post:
 *     summary: Crear una mascota
 *     description: Crea una nueva mascota asociada a un propietario existente y opcionalmente sube una imagen a Cloudinary.
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               ownerId:
 *                 type: integer
 *                 description: ID del propietario de la mascota.
 *                 example: 1
 *               name:
 *                 type: string
 *                 description: Nombre de la mascota.
 *                 example: "Firulais"
 *               gender:
 *                 type: string
 *                 description: Género de la mascota.
 *                 example: "Macho"
 *               weight:
 *                 type: number
 *                 format: float
 *                 description: Peso de la mascota (en kilogramos).
 *                 example: 12.5
 *               height:
 *                 type: string
 *                 description: Altura de la mascota.
 *                 example: "40 cm"
 *               animal:
 *                 type: string
 *                 description: Tipo de animal.
 *                 example: "Perro"
 *               age:
 *                 type: integer
 *                 description: Edad de la mascota (en años).
 *                 example: 3
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de la mascota (opcional).
 *     responses:
 *       201:
 *         description: Mascota creada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mascota creada correctamente"
 *                 newPet:
 *                   type: object
 *                   description: Información de la mascota creada.
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID de la mascota.
 *                     ownerId:
 *                       type: integer
 *                       description: ID del propietario.
 *                     name:
 *                       type: string
 *                       description: Nombre de la mascota.
 *                     gender:
 *                       type: string
 *                       description: Género de la mascota.
 *                     weight:
 *                       type: number
 *                       description: Peso de la mascota.
 *                     height:
 *                       type: string
 *                       description: Altura de la mascota.
 *                     animal:
 *                       type: string
 *                       description: Tipo de animal.
 *                     age:
 *                       type: integer
 *                       description: Edad de la mascota.
 *                     img:
 *                       type: string
 *                       description: URL de la imagen de la mascota.
 *       400:
 *         description: Error en los datos enviados por el cliente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ownerId debe ser un número"
 *       404:
 *         description: Propietario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Owner not found"
 *       500:
 *         description: Error en el servidor o al subir la imagen.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al subir imagen a Cloudinary"
 */

router.post("/createpet", createPet);

/**
 * @swagger
 * /pets/{id}:
 *   put:
 *     summary: Actualizar una mascota
 *     description: Actualiza la información de una mascota existente y opcionalmente su imagen. Calcula la edad total de la mascota en meses desde su creación.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la mascota que se desea actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               weight:
 *                 type: number
 *                 format: float
 *                 description: Nuevo peso de la mascota (en kilogramos).
 *                 example: 10.5
 *               height:
 *                 type: string
 *                 description: Nueva altura de la mascota.
 *                 example: "50 cm"
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Nueva imagen de la mascota (opcional).
 *     responses:
 *       200:
 *         description: Mascota actualizada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mascota actualizada correctamente"
 *                 updatedPet:
 *                   type: object
 *                   description: Información de la mascota actualizada.
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID de la mascota.
 *                     weight:
 *                       type: number
 *                       description: Peso de la mascota.
 *                     height:
 *                       type: string
 *                       description: Altura de la mascota.
 *                     age:
 *                       type: integer
 *                       description: Edad total de la mascota en meses.
 *                     img:
 *                       type: string
 *                       description: URL de la nueva imagen de la mascota.
 *       404:
 *         description: Mascota no encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Pet not found"
 *       500:
 *         description: Error al actualizar la mascota o al cargar la imagen.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al actualizar la mascota"
 */

router.post("/updatepet/:id",updatePet);

/**
 * @swagger
 * /pets/{id}:
 *   get:
 *     summary: Obtener mascotas de un propietario
 *     description: Obtiene todas las mascotas asociadas a un propietario dado su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del propietario cuyas mascotas se desean obtener.
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de mascotas obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID de la mascota.
 *                   ownerId:
 *                     type: integer
 *                     description: ID del propietario.
 *                   name:
 *                     type: string
 *                     description: Nombre de la mascota.
 *                   gender:
 *                     type: string
 *                     description: Género de la mascota.
 *                   weight:
 *                     type: number
 *                     description: Peso de la mascota.
 *                   height:
 *                     type: string
 *                     description: Altura de la mascota.
 *                   animal:
 *                     type: string
 *                     description: Tipo de animal.
 *                   age:
 *                     type: integer
 *                     description: Edad de la mascota.
 *                   img:
 *                     type: string
 *                     description: URL de la imagen de la mascota.
 *       404:
 *         description: Propietario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Owner not found"
 *       500:
 *         description: Error al obtener las mascotas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while fetching pets"
 */

router.get("/getpets/:id", getPets);

/**
 * @swagger
 * /pets/{id}:
 *   get:
 *     summary: Obtener detalles de una mascota
 *     description: Obtiene los detalles de una mascota específica dado su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la mascota que se desea obtener.
 *         example: 1
 *     responses:
 *       200:
 *         description: Detalles de la mascota obtenidos exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID de la mascota.
 *                 ownerId:
 *                   type: integer
 *                   description: ID del propietario.
 *                 name:
 *                   type: string
 *                   description: Nombre de la mascota.
 *                 gender:
 *                   type: string
 *                   description: Género de la mascota.
 *                 weight:
 *                   type: number
 *                   description: Peso de la mascota.
 *                 height:
 *                   type: string
 *                   description: Altura de la mascota.
 *                 animal:
 *                   type: string
 *                   description: Tipo de animal.
 *                 age:
 *                   type: integer
 *                   description: Edad de la mascota.
 *                 img:
 *                   type: string
 *                   description: URL de la imagen de la mascota.
 *       404:
 *         description: Mascota no encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "pet not found"
 *       500:
 *         description: Error al obtener la mascota.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "An error occurred while fetching the pet"
 */

router.get("/getpet/:id", getPet);

/**
 * @swagger
 * /pets/death:
 *   post:
 *     summary: Registrar la muerte de una mascota
 *     description: Mueve una mascota existente a la tabla de fallecidas, elimina sus citas asociadas y registra la fecha de su fallecimiento.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               petId:
 *                 type: integer
 *                 description: ID de la mascota que falleció.
 *                 example: 1
 *               dateOfDeath:
 *                 type: string
 *                 format: date
 *                 description: Fecha de fallecimiento de la mascota (YYYY-MM-DD).
 *                 example: "2024-11-20"
 *     responses:
 *       200:
 *         description: Mascota movida a la tabla de fallecidas exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mascota movida a la tabla de fallecidas"
 *       404:
 *         description: Mascota no encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "La mascota no existe"
 *       500:
 *         description: Error al registrar la muerte de la mascota.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno del servidor"
 */

router.post("/deathPet", deathPet)

router.get("/deathpets/:id", deathPetsById)

module.exports = router