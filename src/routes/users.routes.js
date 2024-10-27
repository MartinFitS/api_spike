// src/routes/users.routes.js

const {Router} = require("express");
const { updateUser, createUser, listUsers, deleteUser ,createVeterinary, listVeterinaries } = require("../controllers/user.controllers");
const verifyTokenFromBody = require("../middlewares/verifyTokenFromBody")

const router = Router();

router.get("/", (req,res) => {
    res.send("Bienvenido a la api de Spike.")
})
router.post("/createUser",createUser);
router.post("/createVeterinary", createVeterinary);
router.post("/deleteUser/:id",verifyTokenFromBody,deleteUser);
router.post("/getUsers",verifyTokenFromBody,listUsers);
router.post("/updateUser/:id",verifyTokenFromBody,updateUser);
router.post("/getVeterinaries", verifyTokenFromBody, listVeterinaries);

module.exports = router;