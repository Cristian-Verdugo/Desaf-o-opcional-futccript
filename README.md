# FutScript — API de equipos y jugadores

API en Node.js para gestionar equipos y jugadores de fútbol. Incluye autenticación por JWT, conexión a PostgreSQL con `pg`, consultas SQL de lectura/escritura, códigos HTTP correctos y pruebas con Jest + Supertest.

## Propósito educativo
- Este proyecto es únicamente con fines educativos. No está destinado para producción ni para el manejo de datos sensibles.
- Usa credenciales y claves de desarrollo; cámbialas y endurece seguridad si piensas adaptarlo a un entorno real.

## Características
- Endpoints REST para equipos y jugadores
- Autenticación JWT con middleware de autorización
- PostgreSQL con `pg` y SQL parametrizado
- Pruebas de integración con Supertest/Jest
- Colección Thunder Client para pruebas manuales

## Requisitos
- Node.js 14+
- PostgreSQL 12+
- Acceso a `psql` o a un cliente SQL

## Instalación
```bash
npm install
```

## Base de datos
1. Crear la base y tablas ejecutando `script.sql` en PostgreSQL:
   ```sql
   CREATE DATABASE futscript;
   \c futscript;

   CREATE TABLE equipos (id SERIAL PRIMARY KEY, name VARCHAR(250) NOT NULL);
   CREATE TABLE posiciones (id SERIAL PRIMARY KEY, name VARCHAR(250) NOT NULL);
   CREATE TABLE jugadores (id SERIAL PRIMARY KEY, id_equipo INT REFERENCES equipos(id), name VARCHAR(250), position INT REFERENCES posiciones(id));

   INSERT INTO posiciones values
   (DEFAULT, 'delantero'),
   (DEFAULT, 'centrocampista'),
   (DEFAULT, 'defensa'),
   (DEFAULT, 'portero');
   ```
2. Credenciales por defecto de la conexión en `db/consultas.js`:
   - `host: 'localhost'`
   - `user: 'postgres'`
   - `password: 'postgres'`
   - `database: 'futscript'`

   Ajusta estos valores según tu entorno.

## Ejecutar
```bash
node index.js
```
Servidor en `http://localhost:3000`.

## Autenticación JWT
- Login: `POST /login`
  - Body: `{"email":"tu@correo.com","password":"123"}`
  - Respuesta: `{"token":"<jwt>"}`
- Usa el token en los endpoints protegidos con `Authorization: Bearer <token>`.

Protegidos por JWT:
- `POST /equipos`
- `POST /equipos/:teamID/jugadores`

No requieren token:
- `GET /equipos`
- `GET /equipos/:teamID/jugadores`

Clave JWT en `utils.js`. Cambia `secretKey` antes de producción.

## Endpoints
- `GET /equipos`
  - Respuesta `200`: lista de equipos
- `POST /equipos`
  - Body: `{"name":"Equipo A"}`
  - Respuesta `201` en éxito, `400` si falta `name`, `401` sin token
- `GET /equipos/:teamID/jugadores`
  - Respuesta `200`: lista de jugadores del equipo
  - `400` si `teamID` inválido
- `POST /equipos/:teamID/jugadores`
  - Body: `{"name":"Juan","position":1}`
  - `position` corresponde a `posiciones` (1: delantero, 2: centrocampista, 3: defensa, 4: portero)
  - Respuesta `201` en éxito, `400` si faltan campos o `position` inválida, `401` sin token

## Códigos de estado
- `200` consultas exitosas
- `201` creación exitosa
- `400` entradas inválidas
- `401` no autorizado (JWT ausente/inválido)
- `500` error interno

## Pruebas
```bash
npm test
```
Incluye casos para:
- `GET /equipos`
- `POST /equipos` (401 sin token, 400 con body inválido, 201 en éxito)
- `GET /equipos/:teamID/jugadores` (400 inválido, 200 válido)
- `POST /equipos/:teamID/jugadores` (401 sin token, 400 inválido, 201 válido)
- `POST /login` (devuelve token)

Los tests mockean la capa de datos y usan Supertest contra la app Express.

## Estructura del proyecto
```
├─ app.js                  # Configura rutas y middlewares
├─ index.js                # Arranque del servidor
├─ controllers/
│  ├─ equipos.js           # Endpoints de equipos
│  ├─ jugadores.js         # Endpoints de jugadores
│  └─ auth.js              # Login y emisión de token
├─ middlewares/
│  └─ auth.js              # Verificación JWT (Bearer)
├─ db/
│  └─ consultas.js         # Pool pg y consultas SQL
├─ __tests__/api.test.js   # Pruebas Jest + Supertest
├─ script.sql              # DDL/DML de la BD
├─ utils.js                # secretKey para JWT
├─ package.json
└─ README.md
```

## Thunder Client / Postman
- Importa `thunder-collection_Futscript.json` para pruebas manuales.
- Flujo sugerido:
  1. `POST /login` → guarda `token`
  2. `POST /equipos` con header `Authorization: Bearer <token>`
  3. `GET /equipos`
  4. `POST /equipos/:teamID/jugadores` con header `Authorization` y body válido
  5. `GET /equipos/:teamID/jugadores`

## Criterios de evaluación (rúbrica)
- JWT: implementado con login y middleware, rutas protegidas.
- Uso de `pg`: conexión con `Pool` y queries parametrizadas.
- Consultas SQL: `SELECT` y `INSERT` para equipos y jugadores, join con `posiciones`.
- Códigos HTTP: `200/201/400/401/500` según corresponde.
- Tests con Supertest: suite completa con 10 pruebas, todas exitosas.

## Notas
- Cambia `secretKey` en `utils.js` antes de subir a producción.
- Si tus credenciales de PostgreSQL difieren, ajusta `db/consultas.js`.
