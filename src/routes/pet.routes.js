
const {Router} = require("express");
const verifyTokenFromBody = require("../middlewares/verifyTokenFromBody");
const {createPet,getPets,getPet,updatePet,deathPet} = require("../controllers/pet.controllers")

const router = Router();

router.post("/createpet", createPet);
router.post("/updatepet/:id",updatePet);
router.get("/getpets/:id", getPets);
router.get("/getpet/:id", getPet);
router.post("/deathPet", deathPet)

module.exports = router