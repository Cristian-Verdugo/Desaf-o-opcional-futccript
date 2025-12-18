const { getTeams, addTeam } = require('../db/consultas')

const obtenerEquipos = async (req, res) => {
    try {
        const equipos = await getTeams()
        res.json(equipos)
    } catch (e) {
        res.status(500).json({ error: 'Error interno' })
    }
}

const agregarEquipo = async (req, res) => {
    try {
        const equipo = req.body
        if (!equipo || typeof equipo.name !== 'string' || !equipo.name.trim()) {
            return res.status(400).json({ error: 'Falta nombre de equipo' })
        }
        await addTeam(equipo)
        res.status(201).send({ message: "Equipo agregado con éxito" })
    } catch (e) {
        if (e.message === 'Nombre de equipo inválido') {
            return res.status(400).json({ error: 'Nombre de equipo inválido' })
        }
        res.status(500).json({ error: 'Error interno' })
    }
}

module.exports = { obtenerEquipos, agregarEquipo }
