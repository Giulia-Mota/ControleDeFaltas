const Materia = require('../models/Materia');

const createMateria = async (req, res) => {
  try {
    // AQUI ESTÁ A CORREÇÃO: Garantimos que ele recebe a cargaHoraria do formulário
    const { nome, professor, limiteFaltas, cargaHoraria } = req.body;
    const userId = req.user.userId;

    const materia = new Materia({
      nome,
      professor,
      cargaHoraria, // E a usa para criar a nova matéria
      limiteFaltas,
      faltas: [],
      user: userId,
    });

    await materia.save();
    res.status(201).json(materia);
  } catch (error) {
    console.error("ERRO DETALHADO AO CRIAR MATÉRIA:", error);
    res.status(400).json({ message: 'Erro ao salvar a matéria no banco de dados.', error: error.message });
  }
};

// As outras funções permanecem iguais
const getMaterias = async (req, res) => {
  try {
    const materias = await Materia.find({ user: req.user.userId });
    res.json(materias);
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor ao buscar matérias.' });
  }
};

const getMateriaById = async (req, res) => {
  try {
    const materia = await Materia.findOne({ _id: req.params.id, user: req.user.userId });
    if (!materia) return res.status(404).json({ message: 'Matéria não encontrada.' });
    res.json(materia);
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor ao buscar matéria específica.' });
  }
};

const addFalta = async (req, res) => {
  try {
    const { date } = req.body;
    const materia = await Materia.findOne({ _id: req.params.id, user: req.user.userId });
    if (!materia) return res.status(404).json({ message: 'Matéria não encontrada.' });
    
    materia.faltas.push({ date });
    await materia.save();
    res.json(materia);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar falta.' });
  }
};

const removeFalta = async (req, res) => {
  try {
    const materia = await Materia.findOne({ _id: req.params.id, user: req.user.userId });
    if (!materia) return res.status(404).json({ message: 'Matéria não encontrada.' });

    materia.faltas.pull({ _id: req.params.faltaId });
    await materia.save();
    res.json(materia);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover falta.' });
  }
};

const deleteMateria = async (req, res) => {
  try {
    const materia = await Materia.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!materia) return res.status(404).json({ message: 'Matéria não encontrada.' });
    res.json({ message: 'Matéria excluída com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir matéria.' });
  }
};

module.exports = {
  createMateria,
  addFalta,
  removeFalta,
  getMaterias,
  getMateriaById,
  deleteMateria,
};