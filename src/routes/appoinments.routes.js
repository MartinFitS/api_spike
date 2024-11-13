const {Router} = require("express");
const router = Router();
const {crearCita,cancelarCita,completadaCita,citasUsuario,citasVet} = require("../controllers/appointment.controllers")

router.post("/crearCita", crearCita);

router.post("/cancelarCita", cancelarCita);

router.post("/citasUsuario", citasUsuario);

router.post("/citasVet", citasVet)

router.post("/citaCompletada", completadaCita)

module.exports = router;
