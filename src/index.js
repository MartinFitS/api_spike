// src/index.js

require('dotenv').config();
const app = require("./app");

const port = process.env.PORT || 3000;

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});