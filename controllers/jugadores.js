const { getPlayers, addPlayer } = require('../db/consultas')

const obtenerJugadores = async (req, res) => {
    try {
        const { teamID } = req.params
        const id = Number(teamID)
        if (!Number.isInteger(id)) {
            return res.status(400).json({ error: 'teamID inválido' })
        }
        const jugadores = await getPlayers(id)
        res.json(jugadores)
    } catch (e) {
        res.status(500).json({ error: 'Error interno' })
    }
}

const registrarJugador = async (req, res) => {
    try {
        const { teamID } = req.params
        const id = Number(teamID)
        if (!Number.isInteger(id)) {
            return res.status(400).json({ error: 'teamID inválido' })
        }
        const jugador = req.body
        if (!jugador || typeof jugador.name !== 'string' || !jugador.name.trim()) {
            return res.status(400).json({ error: 'Falta nombre de jugador' })
        }
        const posicion = Number(jugador.position)
        if (!Number.isInteger(posicion)) {
            return res.status(400).json({ error: 'Posición inválida' })
        }
        await addPlayer({ jugador, teamID: id })
        res.status(201).json({ message: "Jugador agregado con éxito" })
    } catch (e) {
        if (['Nombre de jugador inválido', 'Posición inválida'].includes(e.message)) {
            return res.status(400).json({ error: e.message })
        }
        res.status(500).json({ error: 'Error interno' })
    }
}


module.exports = { obtenerJugadores, registrarJugador }
