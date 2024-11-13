// src/app.js

const express = require('express');
const helmet = require('helmet'); // Importa Helmet
const path = require('path');
const routerUsers = require("./routes/users.routes");
const routerLogin = require("./routes/login.routes");
const routerPet = require("./routes/pet.routes");
const routerAppointment = require("./routes/appoinments.routes");
const routerVerification = require("./routes/verification.routes");

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));


app.use(express.json());

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
