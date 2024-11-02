// src/app.js

const express = require('express');
const helmet = require('helmet'); // Importa Helmet
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const routerUsers = require("./routes/users.routes");
const routerLogin = require("./routes/login.routes");
const routerPet = require("./routes/pet.routes");
const routerAppointment = require("./routes/appoinments.routes");
const routerVerification = require("./routes/verification.routes");

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Configuración de Helmet con CSP
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "https://vercel.live"],
    fontSrc: ["'self'", "https://api-spike-indol.vercel.app"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:"],
    connectSrc: ["'self'"],
  }
}));

// Rutas
app.use(routerLogin);
app.use(routerUsers);
app.use(routerPet);
app.use(routerAppointment);
app.use(routerVerification);

module.exports = app;
