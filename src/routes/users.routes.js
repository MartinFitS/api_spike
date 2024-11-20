// src/routes/users.routes.js

const {Router} = require("express");
const { updateUser, createUser, listUsers, deleteUser ,createVeterinary, listVeterinaries ,updateVeterinary,getVeterinary} = require("../controllers/user.controllers");
const verifyTokenFromBody = require("../middlewares/verifyTokenFromBody")

const router = Router();

router.get("/", (req,res) => {
    res.send("Bienvenido a la api de Spike.")
})

/**
 * @swagger
 * /createUser:
 *   post:
 *     summary: Crear un usuario
 *     description: Crea un nuevo usuario, verifica el correo electrónico y opcionalmente sube una imagen a Cloudinary.
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Nombre del usuario.
 *                 example: "Juan"
 *               lastName:
 *                 type: string
 *                 description: Apellido del usuario.
 *                 example: "Pérez"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario.
 *                 example: "juan.perez@example.com"
 *               phone:
 *                 type: string
 *                 description: Número telefónico del usuario (10 dígitos).
 *                 example: "5551234567"
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario. Debe incluir al menos 8 caracteres, una letra mayúscula, un número y un símbolo especial.
 *                 example: "Password@123"
 *               role:
 *                 type: string
 *                 description: Rol del usuario. Puede ser "PET_OWNER" o "ADMIN".
 *                 example: "PET_OWNER"
 *               city:
 *                 type: string
 *                 description: Ciudad del usuario.
 *                 example: "Ciudad de México"
 *               number_int:
 *                 type: string
 *                 description: Número interior (opcional).
 *                 example: "10"
 *               cp:
 *                 type: string
 *                 description: Código postal del usuario.
 *                 example: "12345"
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del usuario (opcional).
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario creado correctamente. Por favor verifica tu correo"
 *                 newUser:
 *                   type: object
 *                   description: Información del usuario creado.
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID del usuario.
 *                     firstName:
 *                       type: string
 *                       description: Nombre del usuario.
 *                     lastName:
 *                       type: string
 *                       description: Apellido del usuario.
 *                     email:
 *                       type: string
 *                       description: Correo electrónico del usuario.
 *                     phone:
 *                       type: string
 *                       description: Número telefónico del usuario.
 *                     role:
 *                       type: string
 *                       description: Rol del usuario.
 *                     img:
 *                       type: string
 *                       description: URL de la imagen del usuario.
 *       400:
 *         description: Error en los datos enviados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "El correo ya está registrado en la bd"
 *       500:
 *         description: Error interno al crear el usuario o subir la imagen.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al crear usuario"
 */

router.post("/createUser",createUser);

/**
 * @swagger
 * /createVeterinary:
 *   post:
 *     summary: Crear una veterinaria
 *     description: Crea una nueva veterinaria, verifica el correo electrónico, valida los datos ingresados y genera horarios disponibles.
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               veterinarieName:
 *                 type: string
 *                 description: Nombre de la veterinaria.
 *                 example: "Veterinaria Patitas Felices"
 *               street:
 *                 type: string
 *                 description: Calle de la dirección de la veterinaria.
 *                 example: "Av. Reforma"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico de la veterinaria.
 *                 example: "info@patitasfelices.com"
 *               phone:
 *                 type: string
 *                 description: Número telefónico de la veterinaria (10 dígitos).
 *                 example: "5551234567"
 *               password:
 *                 type: string
 *                 description: Contraseña para el administrador de la veterinaria. Debe incluir al menos 8 caracteres, una letra mayúscula, un número y un símbolo especial.
 *                 example: "Password@123"
 *               role:
 *                 type: string
 *                 description: Rol del usuario. Solo acepta "VETERINARY_OWNER".
 *                 example: "VETERINARY_OWNER"
 *               city:
 *                 type: string
 *                 description: Ciudad de la veterinaria.
 *                 example: "Ciudad de México"
 *               locality:
 *                 type: string
 *                 description: Localidad de la veterinaria.
 *                 example: "Centro"
 *               cologne:
 *                 type: string
 *                 description: Colonia de la veterinaria.
 *                 example: "Roma Norte"
 *               number_int:
 *                 type: string
 *                 description: Número interior de la dirección (opcional).
 *                 example: "10"
 *               cp:
 *                 type: string
 *                 description: Código postal de la dirección.
 *                 example: "06700"
 *               rfc:
 *                 type: string
 *                 description: RFC de la veterinaria en formato válido.
 *                 example: "PFA090123ABC"
 *               category:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Categorías de la veterinaria. Las categorías válidas son "NUTRITION", "RECREATION" y "CARE".
 *                 example: ["CARE", "NUTRITION"]
 *               horaInicio:
 *                 type: string
 *                 description: Hora de inicio de operaciones (en formato 24 horas).
 *                 example: "8"
 *               horaFin:
 *                 type: string
 *                 description: Hora de fin de operaciones (en formato 24 horas).
 *                 example: "18"
 *               diasSemana:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Días de la semana en los que opera la veterinaria. Los días válidos son "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday".
 *                 example: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de la veterinaria (opcional).
 *     responses:
 *       201:
 *         description: Veterinaria creada exitosamente con horarios disponibles generados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Veterinaria creada correctamente con horarios disponibles"
 *                 newVeterinarie:
 *                   type: object
 *                   description: Información de la veterinaria creada.
 *       400:
 *         description: Error en los datos enviados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "El número telefónico ya está en uso"
 *       500:
 *         description: Error interno al crear la veterinaria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al crear la veterinaria"
 */

router.post("/createVeterinary", createVeterinary);

/**
 * @swagger
 * /deleteUser/:id:
 *   delete:
 *     summary: Eliminar un usuario o veterinaria
 *     description: Elimina un usuario o una veterinaria de la base de datos. Si se proporciona un RFC, se eliminará una veterinaria; de lo contrario, se eliminará un usuario.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario o veterinaria que se desea eliminar.
 *         example: 1
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rfc:
 *                 type: string
 *                 description: RFC de la veterinaria (opcional). Si se proporciona, se eliminará la veterinaria; de lo contrario, se eliminará el usuario.
 *                 example: "PFA090123ABC"
 *     responses:
 *       200:
 *         description: Usuario o veterinaria eliminado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Usuario borrado correctamente"
 *       500:
 *         description: Error interno al intentar eliminar el usuario o veterinaria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al borrar usuario"
 */

router.post("/deleteUser/:id",deleteUser);

/**
 * @swagger
 * /getUsers:
 *   get:
 *     summary: Listar usuarios y veterinarias
 *     description: Obtiene una lista de todos los usuarios y veterinarias registrados en la base de datos.
 *     responses:
 *       200:
 *         description: Lista de usuarios y veterinarias obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   description: Lista de usuarios.
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID del usuario.
 *                       firstName:
 *                         type: string
 *                         description: Nombre del usuario.
 *                       lastName:
 *                         type: string
 *                         description: Apellido del usuario.
 *                       email:
 *                         type: string
 *                         description: Correo electrónico del usuario.
 *                       phone:
 *                         type: string
 *                         description: Número telefónico del usuario.
 *                       role:
 *                         type: string
 *                         description: Rol del usuario.
 *                       isActive:
 *                         type: boolean
 *                         description: Estado de activación del usuario.
 *                 veterinaries:
 *                   type: array
 *                   description: Lista de veterinarias.
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID de la veterinaria.
 *                       veterinarieName:
 *                         type: string
 *                         description: Nombre de la veterinaria.
 *                       email:
 *                         type: string
 *                         description: Correo electrónico de la veterinaria.
 *                       phone:
 *                         type: string
 *                         description: Número telefónico de la veterinaria.
 *                       rfc:
 *                         type: string
 *                         description: RFC de la veterinaria.
 *       500:
 *         description: Error al obtener los usuarios y veterinarias.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al obtener usuarios"
 */

router.post("/getUsers",verifyTokenFromBody,listUsers);

/**
 * @swagger
 * /updateUser/:id:
 *   put:
 *     summary: Actualizar un usuario o veterinaria
 *     description: Actualiza los datos de un usuario o veterinaria. Si se proporciona un RFC, se actualiza la veterinaria; de lo contrario, se actualiza el usuario.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario o veterinaria que se desea actualizar.
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               rfc:
 *                 type: string
 *                 description: RFC de la veterinaria (opcional). Si se proporciona, se actualiza la veterinaria.
 *                 example: "PFA090123ABC"
 *               password:
 *                 type: string
 *                 description: Nueva contraseña del usuario o veterinaria. Debe incluir al menos 8 caracteres, una mayúscula, un número y un símbolo especial.
 *                 example: "Password@123"
 *               newCategories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Categorías a agregar para la veterinaria. Solo aplica si se proporciona RFC.
 *                 example: ["NUTRITION", "CARE"]
 *               removeCategories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Categorías a remover para la veterinaria. Solo aplica si se proporciona RFC.
 *                 example: ["RECREATION"]
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Nueva imagen del usuario o veterinaria (opcional).
 *               otherFields:
 *                 type: object
 *                 additionalProperties: true
 *                 description: Otros campos que se pueden actualizar (dinámicos según la tabla correspondiente).
 *     responses:
 *       200:
 *         description: Usuario o veterinaria actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Usuario o veterinaria actualizado correctamente"
 *       400:
 *         description: Error en los datos enviados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, un número y un símbolo especial"
 *       500:
 *         description: Error interno al actualizar el usuario o veterinaria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al actualizar el usuario o la veterinaria"
 */

router.post("/updateUser/:id",updateUser);

/**
 * @swagger
 * /updateVeterinary/{id}:
 *   put:
 *     summary: Actualizar una veterinaria
 *     description: Actualiza los datos de una veterinaria, incluyendo categorías, horarios y otros datos. No permite modificar horarios si hay citas pendientes.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la veterinaria que se desea actualizar.
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: Nueva contraseña de la veterinaria. Debe incluir al menos 8 caracteres, una mayúscula, un número y un símbolo especial.
 *                 example: "Password@123"
 *               newCategories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Categorías a agregar para la veterinaria. Las categorías válidas son "NUTRITION", "RECREATION", "CARE".
 *                 example: ["NUTRITION", "CARE"]
 *               removeCategories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Categorías a eliminar para la veterinaria. Las categorías válidas son "NUTRITION", "RECREATION", "CARE".
 *                 example: ["RECREATION"]
 *               horaInicio:
 *                 type: string
 *                 description: Nueva hora de inicio de operaciones (en formato 24 horas).
 *                 example: "8"
 *               horaFin:
 *                 type: string
 *                 description: Nueva hora de fin de operaciones (en formato 24 horas).
 *                 example: "18"
 *               diasSemana:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Nuevos días de la semana en los que opera la veterinaria. Los días válidos son "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday".
 *                 example: ["Monday", "Tuesday", "Wednesday"]
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Nueva imagen de la veterinaria (opcional).
 *               otherFields:
 *                 type: object
 *                 additionalProperties: true
 *                 description: Otros campos que se pueden actualizar.
 *     responses:
 *       200:
 *         description: Veterinaria actualizada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Veterinaria actualizada correctamente"
 *       400:
 *         description: Error en los datos enviados o hay citas pendientes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No se pueden modificar los horarios porque hay citas pendientes."
 *       500:
 *         description: Error interno al actualizar la veterinaria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al actualizar la veterinaria"
 */

router.post("/updateVeterinary/:id",updateVeterinary)

/**
 * @swagger
 * /getVeterinaries:
 *   get:
 *     summary: Listar todas las veterinarias
 *     description: Obtiene una lista de todas las veterinarias registradas en la base de datos.
 *     responses:
 *       200:
 *         description: Lista de veterinarias obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 veterinaries:
 *                   type: array
 *                   description: Lista de veterinarias.
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID de la veterinaria.
 *                       veterinarieName:
 *                         type: string
 *                         description: Nombre de la veterinaria.
 *                       email:
 *                         type: string
 *                         description: Correo electrónico de la veterinaria.
 *                       phone:
 *                         type: string
 *                         description: Número telefónico de la veterinaria.
 *                       city:
 *                         type: string
 *                         description: Ciudad donde se encuentra la veterinaria.
 *                       category:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: Categorías asociadas a la veterinaria.
 *       500:
 *         description: Error al obtener las veterinarias.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al obtener las veterinarias"
 */

router.post("/getVeterinaries", verifyTokenFromBody, listVeterinaries);

/**
 * @swagger
 * /getveterinary/:id:
 *   get:
 *     summary: Obtener detalles de una veterinaria
 *     description: Obtiene los detalles de una veterinaria específica, incluyendo horarios disponibles y citas.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la veterinaria que se desea obtener.
 *         example: 1
 *     responses:
 *       200:
 *         description: Detalles de la veterinaria obtenidos exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 veterinary:
 *                   type: object
 *                   description: Información de la veterinaria.
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID de la veterinaria.
 *                     veterinarieName:
 *                       type: string
 *                       description: Nombre de la veterinaria.
 *                     email:
 *                       type: string
 *                       description: Correo electrónico de la veterinaria.
 *                     phone:
 *                       type: string
 *                       description: Número telefónico de la veterinaria.
 *                     city:
 *                       type: string
 *                       description: Ciudad donde se encuentra la veterinaria.
 *                     category:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Categorías asociadas a la veterinaria.
 *                     hora_ini:
 *                       type: string
 *                       description: Hora de inicio de operaciones.
 *                       example: "08:00"
 *                     hora_fin:
 *                       type: string
 *                       description: Hora de fin de operaciones.
 *                       example: "18:00"
 *                     dias:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Días de operación de la veterinaria.
 *                     appointments:
 *                       type: array
 *                       description: Lista de citas asociadas a la veterinaria.
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: ID de la cita.
 *                           date:
 *                             type: string
 *                             format: date
 *                             description: Fecha de la cita.
 *                           hour:
 *                             type: string
 *                             description: Hora de la cita.
 *       404:
 *         description: Veterinaria no encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Veterinaria no encontrada"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error en el servidor"
 */

router.get("/getveterinary/:id", getVeterinary)
router.get("/user/pets/:userId", verifyTokenFromBody, getUserPets);
router.get("/getUsers/:id", verifyTokenFromBody, getUser);

module.exports = router;