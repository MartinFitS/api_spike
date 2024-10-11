// src/app.js

const express = require('express');
const helmet = require('helmet'); // Importa Helmet
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const routerUsers = require("./routes/users.routes");
const routerLogin = require("./routes/login.routes");

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Configuración de Helmet con CSP
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"], // Permite cargar recursos solo desde el mismo origen
    scriptSrc: ["'self'", "https://vercel.live"], // Permite scripts desde tu dominio y vercel.live
    fontSrc: ["'self'", "https://api-spike-indol.vercel.app"], // Permite fuentes desde tu dominio y api-spike-indol.vercel.app
    styleSrc: ["'self'", "'unsafe-inline'"], // Permite estilos desde tu dominio y estilos en línea si es necesario
    imgSrc: ["'self'", "data:"], // Permite imágenes desde tu dominio y datos en línea
    connectSrc: ["'self'"], // Permite conexiones XHR, WebSocket, etc., desde tu dominio
    // Añade otras directivas según tus necesidades
  }
}));

// Rutas
app.use(routerLogin);
app.use(routerUsers);

module.exports = app;
