const Materia = require('../models/Materia');

// Criar uma nova matéria
const createMateria = async (req, res) => {
  try {
    const { nome, professor, limiteFaltas } = req.body;
    const userId = req.user.userId;

    if (!nome || !professor || limiteFaltas === undefined) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const materia = new Materia({
      nome,
      professor,
      limiteFaltas,
      faltas: 0,
      user: userId,
    });

    await materia.save();
    res.status(201).json(materia);
  } catch (error) {
    console.error("ERRO DETALHADO AO SALVAR MATÉRIA:", error);
    res.status(400).json({ message: 'Erro ao cadastrar matéria no banco de dados.', error: error.message });
  }
};

// (As outras funções do controller continuam iguais)

// Obter todas as matérias do usuário logado
exports.getMaterias = async (req, res) => {
  try {
    console.log('[materiaController] - Iniciando busca de matérias...');
    const materias = await Materia.find({ user: req.user.userId });
    console.log(`[materiaController] - ${materias.length} matérias encontradas. Enviando resposta.`);
    res.json(materias);
  } catch (error) {
    console.error('[materiaController] - ERRO ao buscar matérias:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// Obter uma matéria específica
const getMateriaById = async (req, res) => {
  try {
    const materia = await Materia.findOne({ _id: req.params.id, user: req.user.userId });
    if (!materia) {
      return res.status(404).json({ message: 'Matéria não encontrada' });
    }
    res.json(materia);
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// Adicionar ou remover uma falta
const updateFaltas = async (req, res) => {
  try {
    const { action } = req.body;
    const materia = await Materia.findOne({ _id: req.params.id, user: req.user.userId });

    if (!materia) {
      return res.status(404).json({ message: 'Matéria não encontrada' });
    }

    if (action === 'add') {
      materia.faltas += 1;
    } else if (action === 'remove' && materia.faltas > 0) {
      materia.faltas -= 1;
    }

    await materia.save();
    res.json(materia);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar faltas' });
  }
};

// Excluir uma matéria
const deleteMateria = async (req, res) => {
  try {
    const materia = await Materia.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!materia) {
      return res.status(404).json({ message: 'Matéria não encontrada' });
    }
    res.json({ message: 'Matéria excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir matéria' });
  }
};

// Exporta todas as funções de uma vez no final
module.exports = {
  createMateria,
  getMaterias,
  getMateriaById,
  updateFaltas,
  deleteMateria
};