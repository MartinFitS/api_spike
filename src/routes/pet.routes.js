
const {Router} = require("express");
const verifyTokenFromBody = require("../middlewares/verifyTokenFromBody");
const {createPet,getPets,getPet} = require("../controllers/pet.controllers")

const router = Router();

router.post("/createpet", createPet);
router.get("/getpets/:id", getPets);
router.get("/getpet/:id", getPet)

module.exports = router