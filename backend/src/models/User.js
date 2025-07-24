const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'O nome de usuário é obrigatório.'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'O email é obrigatório.'],
    unique: true,
    match: [/.+\@.+\..+/, 'Por favor, insira um email válido.']
  },
  password: {
    type: String,
    required: [true, 'A senha é obrigatória.'],
    minlength: 6
  }
});

// Criptografa a senha antes de salvar
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', UserSchema);