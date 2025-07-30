const Materia = require('../models/Materia');

const createMateria = async (req, res) => {
  try {
    // AQUI ESTÁ A CORREÇÃO: Garantimos que ele recebe a cargaHoraria do formulário
    const { nome, professor, limiteFaltas, cargaHoraria, aulasPorDia } = req.body;
    const userId = req.user.userId;

    const materia = new Materia({
      nome,
      professor,
      cargaHoraria, // E a usa para criar a nova matéria
      aulasPorDia,
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
    console.log('Matérias retornadas pelo getMaterias:', materias.map(m => ({ 
      id: m._id, 
      nome: m.nome, 
      aulasPorDia: m.aulasPorDia 
    })));
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

const updateMateria = async (req, res) => {
  try {
    const { nome, professor, limiteFaltas, cargaHoraria, aulasPorDia } = req.body;
    const userId = req.user.userId;

    console.log('Dados recebidos para atualização:', { nome, professor, limiteFaltas, cargaHoraria, aulasPorDia });
    console.log('Tipo de aulasPorDia:', typeof aulasPorDia, 'Valor:', aulasPorDia);

    // Usar findOneAndUpdate para garantir que todos os campos sejam atualizados
    const materia = await Materia.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      {
        nome,
        professor,
        limiteFaltas,
        cargaHoraria,
        aulasPorDia
      },
      { new: true, runValidators: true }
    );

    if (!materia) return res.status(404).json({ message: 'Matéria não encontrada.' });

    console.log('Matéria após atualização:', {
      id: materia._id,
      nome: materia.nome,
      aulasPorDia: materia.aulasPorDia
    });
    
    // Verificar se o campo está sendo incluído na resposta
    const materiaResponse = materia.toObject();
    console.log('Matéria na resposta (toObject):', {
      id: materiaResponse._id,
      nome: materiaResponse.nome,
      aulasPorDia: materiaResponse.aulasPorDia,
      todasAsChaves: Object.keys(materiaResponse)
    });
    
    res.json(materia);
  } catch (error) {
    console.error("ERRO AO ATUALIZAR MATÉRIA:", error);
    res.status(500).json({ message: 'Erro ao atualizar a matéria.', error: error.message });
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
  updateMateria,
  deleteMateria,
};