// src/index.js

require('dotenv').config();
const app = require("./app");

// Usar el puerto proporcionado por Vercel
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
