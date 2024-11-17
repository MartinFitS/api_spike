// src/routes/login.routes.js

const {Router} = require("express");
const {login} = require("../controllers/login.controllers")


const router = Router();
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Autentica al usuario mediante email y contraseña. Devuelve un token JWT y la información del usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: Información del usuario autenticado
 *                   example:
 *                     id: 1
 *                     email: user@example.com
 *                 token:
 *                   type: string
 *                   description: Token JWT
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Contraseña incorrecta
 *       403:
 *         description: La cuenta no está verificada
 *       404:
 *         description: Email no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.post("/login", login);


module.exports = router;