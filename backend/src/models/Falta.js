const mongoose = require('mongoose');

const faltaSchema = new mongoose.Schema({
  materiaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Materia',
    required: true,
  },
  data: {
    type: Date,
    required: true,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

// Evita o erro de recompilação do modelo
module.exports = mongoose.models.Falta || mongoose.model('Falta', faltaSchema);