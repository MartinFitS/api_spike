// src/routes/users.routes.js

const {Router} = require("express");
const { createUser, updateUser, listUsers, listVeterinaries, deleteUser, createVeterinary } = require('../controllers/user.controllers');
const verifyTokenFromBody = require("../middlewares/verifyTokenFromBody")

const router = Router();

router.get("/", (req,res) => {
    res.send("Bienvenido a la api de Spike.")
})
router.post("/createUser",verifyTokenFromBody,createUser);
router.post("/createVeterinary",verifyTokenFromBody, createVeterinary);
router.post("/deleteUser/:id",verifyTokenFromBody,deleteUser);
router.post("/getUsers",verifyTokenFromBody,listUsers);
router.post("/updateUser/:id",updateUser);
router.get("/getVeterinaries", verifyTokenFromBody, listVeterinaries);

module.exports = router;