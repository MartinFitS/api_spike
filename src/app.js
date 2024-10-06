// app.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const routerUsers = require("./routes/users.routes")

const app = express();

app.use(express.json());
app.use(routerUsers);

module.exports = app;


// // Ruta raíz
// app.get('/', (req, res) => {
//   res.send('Bienvenido a la API de Spike');
// });

// // Ruta GET para obtener todos los mensajes
// app.get('/messages', async (req, res) => {
//   try {
//     const messages = await prisma.holamundo.findMany();
//     res.json(messages);
//   } catch (error) {
//     res.status(500).json({ error: 'Error al obtener mensajes' });
//   }
// });

// // Ruta POST para crear un nuevo mensaje
// app.post('/messages', async (req, res) => {
//   const { message } = req.body;
//   try {
//     const newMessage = await prisma.holamundo.create({
//       data: { message },
//     });
//     res.json(newMessage);
//   } catch (error) {
//     res.status(500).json({ error: 'Error al crear mensaje' });
//   }
// });

// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Servidor corriendo en el puerto ${port}`);
// });

