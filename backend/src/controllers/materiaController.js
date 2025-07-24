const Materia = require('../models/Materia');
const Falta = require('../models/Falta');

exports.create = async (req, res) => {
  try {
    const { nome, professor, cargaHoraria, aulasPorSemana, aulasPorDia, horarios, datasAulas, limiteFaltas } = req.body;
    if (!nome || !professor || !cargaHoraria || !aulasPorSemana || !aulasPorDia || !horarios || !limiteFaltas) {
      return res.status(400).json({ message: 'Preencha todos os campos obrigatórios.' });
    }
    const materia = new Materia({
      nome,
      professor,
      cargaHoraria,
      aulasPorSemana,
      aulasPorDia,
      horarios,
      datasAulas,
      limiteFaltas,
      user: req.userId
    });
    await materia.save();
    return res.status(201).json({ message: 'Matéria cadastrada com sucesso!', materia });
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao cadastrar matéria.' });
  }
};

exports.list = async (req, res) => {
  try {
    const materias = await Materia.find({ user: req.userId });
    return res.status(200).json(materias);
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao buscar matérias.' });
  }
};

exports.progressoFaltas = async (req, res) => {
  try {
    const { materiaId } = req.params;
    const materia = await Materia.findOne({ _id: materiaId, user: req.userId });
    if (!materia) {
      return res.status(404).json({ message: 'Matéria não encontrada.' });
    }
    const faltas = await Falta.find({ materia: materiaId, user: req.userId });
    const totalFaltas = faltas.length;
    const limiteFaltas = materia.limiteFaltas;
    const emRisco = totalFaltas >= limiteFaltas * 0.75;
    return res.status(200).json({
      totalFaltas,
      limiteFaltas,
      emRisco,
      podeFaltar: Math.max(0, limiteFaltas - totalFaltas)
    });
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao calcular progresso de faltas.' });
  }
};

exports.relatorioGeral = async (req, res) => {
  try {
    const materias = await Materia.find({ user: req.userId });
    const relatorio = await Promise.all(materias.map(async (materia) => {
      const faltas = await Falta.countDocuments({ materia: materia._id, user: req.userId });
      const emRisco = faltas >= materia.limiteFaltas * 0.75;
      return {
        materiaId: materia._id,
        nome: materia.nome,
        professor: materia.professor,
        limiteFaltas: materia.limiteFaltas,
        totalFaltas: faltas,
        emRisco,
        podeFaltar: Math.max(0, materia.limiteFaltas - faltas)
      };
    }));
    return res.status(200).json(relatorio);
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao gerar relatório.' });
  }
}; 