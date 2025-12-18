const jwt = require('jsonwebtoken')
const { secretKey } = require('../utils')

const authenticate = (req, res, next) => {
  const header = req.headers.authorization || ''
  const parts = header.split(' ')
  if (parts[0] !== 'Bearer' || !parts[1]) {
    return res.status(401).json({ error: 'No autorizado' })
  }
  try {
    const payload = jwt.verify(parts[1], secretKey)
    req.user = payload
    next()
  } catch (e) {
    return res.status(401).json({ error: 'No autorizado' })
  }
}

module.exports = { authenticate }
