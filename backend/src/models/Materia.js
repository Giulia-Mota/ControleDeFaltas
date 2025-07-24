const mongoose = require('mongoose');

const horarioSchema = new mongoose.Schema({
  dia: String, // Ex: 'Terça'
  horarios: [String] // Ex: ['08:00-09:00', '09:00-10:00']
});

const materiaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  professor: { type: String, required: true },
  cargaHoraria: { type: Number, required: true },
  aulasPorSemana: { type: Number, required: true },
  aulasPorDia: { type: Number, required: true },
  horarios: [horarioSchema],
  datasAulas: [Date],
  limiteFaltas: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Materia', materiaSchema); 