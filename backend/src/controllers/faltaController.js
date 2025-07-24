const Falta = require('../models/Falta');

exports.registrar = async (req, res) => {
  try {
    const { materiaId, data, observacao } = req.body;
    if (!materiaId || !data) {
      return res.status(400).json({ message: 'Matéria e data são obrigatórios.' });
    }
    const falta = new Falta({
      materia: materiaId,
      user: req.userId,
      data,
      observacao
    });
    await falta.save();
    return res.status(201).json({ message: 'Falta registrada com sucesso!', falta });
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao registrar falta.' });
  }
};

exports.listarPorMateria = async (req, res) => {
  try {
    const { materiaId } = req.params;
    const faltas = await Falta.find({ materia: materiaId, user: req.userId }).sort({ data: 1 });
    return res.status(200).json(faltas);
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao buscar faltas.' });
  }
};

exports.editar = async (req, res) => {
  try {
    const { faltaId } = req.params;
    const { data, observacao } = req.body;
    const falta = await Falta.findOne({ _id: faltaId, user: req.userId });
    if (!falta) {
      return res.status(404).json({ message: 'Falta não encontrada.' });
    }
    if (data) falta.data = data;
    if (observacao !== undefined) falta.observacao = observacao;
    await falta.save();
    return res.status(200).json({ message: 'Falta atualizada com sucesso!', falta });
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao editar falta.' });
  }
};

exports.deletar = async (req, res) => {
  try {
    const { faltaId } = req.params;
    const falta = await Falta.findOneAndDelete({ _id: faltaId, user: req.userId });
    if (!falta) {
      return res.status(404).json({ message: 'Falta não encontrada.' });
    }
    return res.status(200).json({ message: 'Falta deletada com sucesso!' });
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao deletar falta.' });
  }
}; 