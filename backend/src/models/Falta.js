const mongoose = require('mongoose');

const materiaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'O nome da matéria é obrigatório.'],
  },
  professor: {
    type: String,
    required: [true, 'O nome do professor é obrigatório.'],
  },
  limiteFaltas: {
    type: Number,
    required: [true, 'O limite de faltas é obrigatório.'],
  },
  // ALTERAÇÃO IMPORTANTE: 'faltas' agora é uma lista de objetos com datas
  faltas: [{
    date: {
      type: Date,
      required: true
    }
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Materia', materiaSchema);