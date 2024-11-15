// src/routes/users.routes.js

const {Router} = require("express");
const { updateUser, createUser, listUsers, deleteUser ,createVeterinary, listVeterinaries ,updateVeterinary,getVeterinary} = require("../controllers/user.controllers");
const verifyTokenFromBody = require("../middlewares/verifyTokenFromBody")

const router = Router();

router.get("/", (req,res) => {
    res.send("Bienvenido a la api de Spike.")
})
router.post("/createUser",createUser);
router.post("/createVeterinary", createVeterinary);
router.post("/deleteUser/:id",verifyTokenFromBody,deleteUser);
router.post("/getUsers",verifyTokenFromBody,listUsers);
router.post("/updateUser/:id",updateUser);
router.post("/updateVeterinary/:id",updateVeterinary)
router.post("/getVeterinaries", verifyTokenFromBody, listVeterinaries);
router.get("/getveterinary/:id", getVeterinary)

module.exports = router;