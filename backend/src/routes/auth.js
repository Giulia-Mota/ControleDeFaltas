const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Importamos as funções diretamente do controller
const { register, login, getMe } = require('../controllers/authController');

// Agora usamos as funções que importamos
router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);

module.exports = router;