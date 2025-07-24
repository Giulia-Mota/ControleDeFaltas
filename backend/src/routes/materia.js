const express = require('express');
const router = express.Router();
const materiaController = require('../controllers/materiaController');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, materiaController.create);
router.get('/', auth, materiaController.list);
router.get('/:materiaId/progresso', auth, materiaController.progressoFaltas);
router.get('/relatorio/geral', auth, materiaController.relatorioGeral);

module.exports = router; 