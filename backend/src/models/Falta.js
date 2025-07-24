const mongoose = require('mongoose');

const faltaSchema = new mongoose.Schema({
  materia: { type: mongoose.Schema.Types.ObjectId, ref: 'Materia', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  data: { type: Date, required: true },
  observacao: { type: String }
});

module.exports = mongoose.model('Falta', faltaSchema); 