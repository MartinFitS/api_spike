const {Router} = require("express");
const router = Router();
const {crearCita,cancelarCita,completadaCita} = require("../controllers/appointment.controllers")

router.post("/crearCita", crearCita);

router.post("/cancelarCita", cancelarCita);

router.post("/citaCompletada", completadaCita)

module.exports = router;
