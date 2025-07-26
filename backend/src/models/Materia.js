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
  // AQUI ESTÁ A CORREÇÃO: Adicionamos o campo para guardar a carga horária
  cargaHoraria: {
    type: Number,
    required: [true, 'A carga horária é obrigatória.'],
  },
  limiteFaltas: {
    type: Number,
    required: [true, 'O limite de faltas é obrigatório.'],
  },
  faltas: [{
    date: {
      type: Date,
      required: true,
      default: Date.now
    }
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

// Evita o erro de recompilação do modelo
module.exports = mongoose.models.Materia || mongoose.model('Materia', materiaSchema);