const {Router} = require("express");
const router = Router();
const {crearCita,cancelarCita,completadaCita,citasUsuario,citasVet,cancelarCitaUsuario} = require("../controllers/appointment.controllers")

/**
 * @swagger
 * /crearCita:
 *   post:
 *     summary: Crear una cita
 *     description: Crea una cita para una mascota en una veterinaria y envía una confirmación por correo electrónico al usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               veterinaryId:
 *                 type: string
 *                 description: ID de la veterinaria donde se realizará la cita.
 *                 example: "123"
 *               petId:
 *                 type: string
 *                 description: ID de la mascota para la cual se agenda la cita.
 *                 example: "456"
 *               userId:
 *                 type: string
 *                 description: ID del usuario que solicita la cita.
 *                 example: "789"
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Fecha de la cita (YYYY-MM-DD).
 *                 example: "2024-11-20"
 *               hour:
 *                 type: string
 *                 description: Hora de la cita (HH:mm en formato de 24 horas).
 *                 example: "10:30"
 *     responses:
 *       201:
 *         description: Cita creada exitosamente y correo enviado al usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cita creada exitosamente y correo enviado"
 *                 nuevaCita:
 *                   type: object
 *                   description: Detalles de la cita creada.
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID de la cita.
 *                     veterinaryId:
 *                       type: string
 *                       description: ID de la veterinaria.
 *                     petId:
 *                       type: string
 *                       description: ID de la mascota.
 *                     userId:
 *                       type: string
 *                       description: ID del usuario.
 *                     date:
 *                       type: string
 *                       format: date
 *                       description: Fecha de la cita.
 *                     hourId:
 *                       type: string
 *                       description: ID del horario de la cita.
 *       400:
 *         description: Error en los datos proporcionados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Todos los campos son requeridos"
 *       403:
 *         description: Acción no permitida.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "La mascota no pertenece al usuario"
 *       404:
 *         description: No se encontraron los datos necesarios.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "El usuario no existe"
 *       500:
 *         description: Error al crear la cita.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al crear la cita"
 */

router.post("/crearCita", crearCita);

/**
 * @swagger
 * /cancelarCita:
 *   post:
 *     summary: Cancelar una cita
 *     description: Cancela una cita existente si se hace con al menos 3 días de anticipación.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appointmentId:
 *                 type: string
 *                 description: ID de la cita a cancelar.
 *                 example: "123"
 *     responses:
 *       200:
 *         description: Cita cancelada exitosamente y el horario fue reabierto.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cita cancelada exitosamente y el horario ha sido reabierto"
 *       400:
 *         description: No se puede cancelar la cita porque no se cumplen los requisitos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "La cita solo se puede cancelar con al menos 3 días de anticipación"
 *       404:
 *         description: La cita no fue encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cita no encontrada"
 *       500:
 *         description: Error en el servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error en el servidor"
 */


router.post("/cancelarCita", cancelarCita);

/**
 * @swagger
 * /citasUsuario:
 *   post:
 *     summary: Obtener citas del usuario
 *     description: Obtiene todas las citas asociadas a un usuario, separándolas en completadas y pendientes.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ownerId:
 *                 type: string
 *                 description: ID del usuario propietario de las citas.
 *                 example: "123"
 *     responses:
 *       200:
 *         description: Lista de citas del usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 completadas:
 *                   type: array
 *                   description: Citas que ya han sido completadas.
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: ID de la cita.
 *                         example: "abc123"
 *                       pet:
 *                         type: object
 *                         description: Información de la mascota asociada a la cita.
 *                       hour:
 *                         type: object
 *                         description: Información del horario de la cita.
 *                       user:
 *                         type: object
 *                         description: Información del usuario que realizó la cita.
 *                 pendientes:
 *                   type: array
 *                   description: Citas que aún no se han completado.
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: ID de la cita.
 *                         example: "xyz789"
 *                       pet:
 *                         type: object
 *                         description: Información de la mascota asociada a la cita.
 *                       hour:
 *                         type: object
 *                         description: Información del horario de la cita.
 *                       user:
 *                         type: object
 *                         description: Información del usuario que realizó la cita.
 *       500:
 *         description: Error al obtener las citas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Ocurrió un error al obtener las citas del usuario."
 */

router.post("/citasUsuario", citasUsuario);

/**
 * @swagger
 * /citasVet:
 *   post:
 *     summary: Obtener citas de la veterinaria
 *     description: Obtiene todas las citas asociadas a una veterinaria, separándolas en completadas y pendientes.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vetId:
 *                 type: string
 *                 description: ID de la veterinaria para la cual se obtendrán las citas.
 *                 example: "123"
 *     responses:
 *       200:
 *         description: Lista de citas de la veterinaria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 completadas:
 *                   type: array
 *                   description: Citas que ya han sido completadas.
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: ID de la cita.
 *                         example: "abc123"
 *                       pet:
 *                         type: object
 *                         description: Información de la mascota asociada a la cita.
 *                       hour:
 *                         type: object
 *                         description: Información del horario de la cita.
 *                       user:
 *                         type: object
 *                         description: Información del usuario que realizó la cita.
 *                 pendientes:
 *                   type: array
 *                   description: Citas que aún no se han completado.
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: ID de la cita.
 *                         example: "xyz789"
 *                       pet:
 *                         type: object
 *                         description: Información de la mascota asociada a la cita.
 *                       hour:
 *                         type: object
 *                         description: Información del horario de la cita.
 *                       user:
 *                         type: object
 *                         description: Información del usuario que realizó la cita.
 *       500:
 *         description: Error al obtener las citas de la veterinaria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Ocurrió un error al obtener las citas de la veterinaria."
 */

router.post("/citasVet", citasVet)

/**
 * @swagger
 * /citaCompletada:
 *   post:
 *     summary: Marcar cita como completada
 *     description: Marca una cita existente como completada.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appointmentId:
 *                 type: string
 *                 description: ID de la cita que se desea marcar como completada.
 *                 example: "abc123"
 *     responses:
 *       200:
 *         description: Cita marcada como realizada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cita marcada como realizada"
 *                 cita:
 *                   type: object
 *                   description: Detalles de la cita actualizada.
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID de la cita.
 *                     done:
 *                       type: boolean
 *                       description: Estado de la cita.
 *                       example: true
 *       404:
 *         description: Cita no encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cita no encontrada"
 *       500:
 *         description: Error en el servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error en el servidor"
 */

router.post("/citaCompletada", completadaCita)

router.post("/cancelarcita/usuario", cancelarCitaUsuario)

module.exports = router;
