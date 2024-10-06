const {Router} = require("express");
const { updateUser, createUser, listUsers, deleteUser } = require("../controllers/user.controllers");


const router = Router();

router.post("/updateUser",updateUser);
router.post("/createUser",createUser);
router.delete("/deleteUser/:id",deleteUser);
router.get("/getUsers",listUsers);

module.exports = router;