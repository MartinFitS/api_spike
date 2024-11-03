const { Router } = require('express');
const { verifyEmail, deleteUser } = require('../controllers/verification.controllers');
const verifyTokenFromBody = require('../middlewares/verifyTokenFromBody');

const router = Router();

router.get('/verify-email', verifyTokenFromBody, verifyEmail);
router.get('/delete-user', verifyTokenFromBody, deleteUser);

module.exports = router;