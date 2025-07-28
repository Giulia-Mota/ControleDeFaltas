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

exports.listarTodasPorUsuario = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    
    const faltasNovas = await Falta.find({ user: userId }).populate('materiaId', 'nome');
    const Materia = require('../models/Materia');
    const materiasComFaltas = await Materia.find({ user: userId });
    
    const faltasPorData = {};
    
    faltasNovas.forEach(falta => {
      const dataStr = falta.data.toISOString().split('T')[0];
      if (!faltasPorData[dataStr]) faltasPorData[dataStr] = [];
      faltasPorData[dataStr].push({
        materiaId: falta.materiaId._id,
        materiaNome: falta.materiaId.nome,
        faltaId: falta._id,
        data: falta.data,
        tipo: 'nova'
      });
    });
    
    materiasComFaltas.forEach(materia => {
      materia.faltas.forEach(falta => {
        const dataStr = falta.date.toISOString().split('T')[0];
        if (!faltasPorData[dataStr]) faltasPorData[dataStr] = [];
        faltasPorData[dataStr].push({
          materiaId: materia._id,
          materiaNome: materia.nome,
          faltaId: falta._id,
          data: falta.date,
          tipo: 'antiga'
        });
      });
    });
    
    return res.status(200).json(faltasPorData);
  } catch (err) {
    console.error('Erro ao buscar faltas:', err);
    return res.status(500).json({ message: 'Erro ao buscar faltas do usuário.' });
  }
}; 