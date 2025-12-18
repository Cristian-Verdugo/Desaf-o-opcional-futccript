const request = require('supertest')
const jwt = require('jsonwebtoken')
const { secretKey } = require('../utils')
jest.mock('../db/consultas', () => ({
  getTeams: jest.fn(),
  addTeam: jest.fn(),
  getPlayers: jest.fn(),
  addPlayer: jest.fn()
}))
const { getTeams, addTeam, getPlayers, addPlayer } = require('../db/consultas')
const app = require('../app')

describe('API FutScript', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('GET /equipos responde 200 y lista', async () => {
    getTeams.mockResolvedValue([{ id: 1, name: 'Equipo A' }])
    const res = await request(app).get('/equipos')
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual([{ id: 1, name: 'Equipo A' }])
  })

  test('POST /equipos sin name responde 400', async () => {
    const token = jwt.sign({ email: 'a@b.com' }, secretKey)
    const res = await request(app).post('/equipos').set('Authorization', `Bearer ${token}`).send({})
    expect(res.statusCode).toBe(400)
  })

  test('POST /equipos válido responde 201', async () => {
    addTeam.mockResolvedValue({ id: 1, name: 'Equipo A' })
    const token = jwt.sign({ email: 'a@b.com' }, secretKey)
    const res = await request(app).post('/equipos').set('Authorization', `Bearer ${token}`).send({ name: 'Equipo A' })
    expect(addTeam).toHaveBeenCalledWith({ name: 'Equipo A' })
    expect(res.statusCode).toBe(201)
    expect(res.body).toEqual({ message: 'Equipo agregado con éxito' })
  })

  test('GET /equipos/1/jugadores responde 200 y lista', async () => {
    getPlayers.mockResolvedValue([{ id: 1, name: 'Juan', position: 1, position_name: 'delantero' }])
    const res = await request(app).get('/equipos/1/jugadores')
    expect(getPlayers).toHaveBeenCalledWith(1)
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual([{ id: 1, name: 'Juan', position: 1, position_name: 'delantero' }])
  })

  test('GET /equipos/abc/jugadores responde 400', async () => {
    const res = await request(app).get('/equipos/abc/jugadores')
    expect(res.statusCode).toBe(400)
  })

  test('POST /equipos/1/jugadores sin campos responde 400', async () => {
    const token = jwt.sign({ email: 'a@b.com' }, secretKey)
    const res = await request(app).post('/equipos/1/jugadores').set('Authorization', `Bearer ${token}`).send({})
    expect(res.statusCode).toBe(400)
  })

  test('POST /equipos/1/jugadores válido responde 201', async () => {
    addPlayer.mockResolvedValue({ id: 1, id_equipo: 1, name: 'Juan', position: 1 })
    const token = jwt.sign({ email: 'a@b.com' }, secretKey)
    const res = await request(app).post('/equipos/1/jugadores').set('Authorization', `Bearer ${token}`).send({ name: 'Juan', position: 1 })
    expect(addPlayer).toHaveBeenCalledWith({ jugador: { name: 'Juan', position: 1 }, teamID: 1 })
    expect(res.statusCode).toBe(201)
    expect(res.body).toEqual({ message: 'Jugador agregado con éxito' })
  })

  test('POST /equipos sin token responde 401', async () => {
    const res = await request(app).post('/equipos').send({ name: 'Equipo A' })
    expect(res.statusCode).toBe(401)
  })

  test('POST /equipos/1/jugadores sin token responde 401', async () => {
    const res = await request(app).post('/equipos/1/jugadores').send({ name: 'Juan', position: 1 })
    expect(res.statusCode).toBe(401)
  })

  test('POST /login devuelve token', async () => {
    const res = await request(app).post('/login').send({ email: 'a@b.com', password: '123' })
    expect(res.statusCode).toBe(200)
    expect(typeof res.body.token).toBe('string')
  })
})
