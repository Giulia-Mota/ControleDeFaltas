const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  createMateria,
  getMaterias,
  getMateriaById,
  addFalta,
  removeFalta,
  deleteMateria
} = require('../controllers/materiaController');

// Rotas principais
router.post('/', authMiddleware, createMateria);
router.get('/', authMiddleware, getMaterias);
router.get('/:id', authMiddleware, getMateriaById);
router.delete('/:id', authMiddleware, deleteMateria);

// Rotas para gerir faltas com data
router.post('/:id/faltas', authMiddleware, addFalta);
router.delete('/:id/faltas/:faltaId', authMiddleware, removeFalta);

module.exports = router;