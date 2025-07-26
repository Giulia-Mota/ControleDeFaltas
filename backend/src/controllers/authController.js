const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    // Verifica erro de duplicidade (usuário ou email já existe)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      let msg = '';
      if (field === 'username') msg = 'Nome de usuário já existe.';
      else if (field === 'email') msg = 'Email já está em uso.';
      else msg = 'Usuário ou email já cadastrado.';
      return res.status(400).json({ message: msg });
    }
    res.status(400).json({ message: 'Erro ao registrar usuário', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

module.exports = {
  register,
  login,
  getMe,
};