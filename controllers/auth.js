const jwt = require('jsonwebtoken')
const { secretKey } = require('../utils')

const login = (req, res) => {
  const { email, password } = req.body || {}
  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password.trim()) {
    return res.status(400).json({ error: 'Credenciales inválidas' })
  }
  const token = jwt.sign({ email: email.trim() }, secretKey, { expiresIn: '1h' })
  res.json({ token })
}

module.exports = { login }
