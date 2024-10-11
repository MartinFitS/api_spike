// src/routes/login.routes.js

const {Router} = require("express");
const {login} = require("../controllers/login.controllers")


const router = Router();

router.post("/login", login);

module.exports = router;