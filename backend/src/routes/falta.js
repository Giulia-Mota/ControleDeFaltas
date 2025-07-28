const express = require('express');
const router = express.Router();
const faltaController = require('../controllers/faltaController');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, faltaController.registrar);
router.get('/usuario', auth, faltaController.listarTodasPorUsuario);
router.get('/:materiaId', auth, faltaController.listarPorMateria);
router.put('/:faltaId', auth, faltaController.editar);
router.delete('/:faltaId', auth, faltaController.deletar);

module.exports = router; 