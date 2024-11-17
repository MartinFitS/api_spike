const swaggerJsDoc = require("swagger-jsdoc");
require('dotenv').config();
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Documentación para la api de spike.",
      version: "1.0.0",
      description: "Documentación generada con Swagger para la api de spike.",
    },
    servers: [
      {
        url: process.env.BASE_URL 
      },
    ],
  },
  apis: ["./src/routes/*.js"]
 
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

module.exports = swaggerSpec;
