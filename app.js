const express = require('express')
const app = express()
app.use(express.json())

const { obtenerJugadores, registrarJugador } = require('./controllers/jugadores')
const { obtenerEquipos, agregarEquipo } = require('./controllers/equipos')
const { login } = require('./controllers/auth')
const { authenticate } = require('./middlewares/auth')

app.post('/login', login)
app.get('/equipos', obtenerEquipos)
app.post('/equipos', authenticate, agregarEquipo)
app.get('/equipos/:teamID/jugadores', obtenerJugadores)
app.post('/equipos/:teamID/jugadores', authenticate, registrarJugador)

module.exports = app
