const {Router} = require("express");
const { updateUser, createUser, listUsers, deleteUser ,createVeterinary} = require("../controllers/user.controllers");


const router = Router();

router.post("/createUser",createUser);
router.post("/createVeterinary", createVeterinary);
router.post("/deleteUser/:id",deleteUser);
router.get("/getUsers",listUsers);
router.post("/updateUser",updateUser);

module.exports = router;