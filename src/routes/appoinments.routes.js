const {Router} = require("express");
const router = Router();
const {crearCita} = require("../controllers/appointment.controllers")

router.post("/crearCita", crearCita);

module.exports = router;