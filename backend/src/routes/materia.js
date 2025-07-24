const mongoose = require('mongoose');

const materiaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  professor: {
    type: String,
    required: true,
  },
  limiteFaltas: { // O único campo de faltas que precisamos salvar
    type: Number,
    required: true,
    default: 0,
  },
  faltas: {
    type: Number,
    required: true,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Materia', materiaSchema);