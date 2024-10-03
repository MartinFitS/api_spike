const {Router} = require("express");

const { updateUser } = require("../controllers/user.controllers");


const router = Router();

router.post("/updateUser",updateUser);

module.exports = router;