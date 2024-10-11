// app.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const routerUsers = require("./routes/users.routes");
const routerLogin = require("./routes/login.routes")

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use(routerLogin);
app.use(routerUsers);

 
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}/`);
  });
 
module.exports = app;