const { Pool } = require('pg')

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'futscript',
    allowExitOnIdle: true
})

const getTeams = async () => {
    try {
        const { rows } = await pool.query('SELECT id, name FROM equipos ORDER BY id')
        return rows
    } catch (e) {
        throw new Error('Error al obtener equipos')
    }
}

const getPlayers = async (teamID) => {
    try {
        const id = Number(teamID)
        const { rows } = await pool.query(
            `SELECT j.id, j.name, j.position, p.name AS position_name
             FROM jugadores j
             JOIN posiciones p ON j.position = p.id
             WHERE j.id_equipo = $1
             ORDER BY j.id`,
            [id]
        )
        return rows
    } catch (e) {
        throw new Error('Error al obtener jugadores')
    }
}

const addTeam = async (equipo) => {
    try {
        if (!equipo || typeof equipo.name !== 'string' || !equipo.name.trim()) {
            throw new Error('Nombre de equipo inválido')
        }
        const { rows } = await pool.query(
            'INSERT INTO equipos(name) VALUES($1) RETURNING id, name',
            [equipo.name.trim()]
        )
        return rows[0]
    } catch (e) {
        if (e.message === 'Nombre de equipo inválido') throw e
        throw new Error('Error al agregar equipo')
    }
}

const addPlayer = async ({ jugador, teamID }) => {
    try {
        const idEquipo = Number(teamID)
        if (!jugador || typeof jugador.name !== 'string' || !jugador.name.trim()) {
            throw new Error('Nombre de jugador inválido')
        }
        const posicion = Number(jugador.position)
        if (!Number.isInteger(posicion)) {
            throw new Error('Posición inválida')
        }
        const { rows } = await pool.query(
            'INSERT INTO jugadores(id_equipo, name, position) VALUES($1, $2, $3) RETURNING id, id_equipo, name, position',
            [idEquipo, jugador.name.trim(), posicion]
        )
        return rows[0]
    } catch (e) {
        if (['Nombre de jugador inválido', 'Posición inválida'].includes(e.message)) throw e
        throw new Error('Error al agregar jugador')
    }
}

module.exports = { getTeams, addTeam, getPlayers, addPlayer }
