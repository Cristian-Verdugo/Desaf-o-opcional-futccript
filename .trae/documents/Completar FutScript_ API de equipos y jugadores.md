## Contexto del proyecto
- Servidor Express y rutas en `c:\Users\Crist\OneDrive - Cibeles Telecom\Escritorio\Fullstack\Backend\nodejs\8 Testing\Desafío opcional\Apoyo Desafío - FutScript\index.js`:4-15.
- Controladores: `controllers/equipos.js`:3-12 y `controllers/jugadores.js`:3-14.
- Capa de datos pendiente en `db/consultas.js`:11-25.
- Esquema y seed en `script.sql`:1-14.
- Dependencias para API y tests en `package.json`:11-17.

## Objetivo
- Entregar una API funcional para gestionar equipos y jugadores, siguiendo el PDF. Endpoints:
  - `GET /equipos`, `POST /equipos`.
  - `GET /equipos/:teamID/jugadores`, `POST /equipos/:teamID/jugadores`.

## Pasos técnicos
### 1. Preparar entorno
- Instalar dependencias con `npm install`.
- Crear BD y tablas ejecutando `script.sql` en PostgreSQL.

### 2. Implementar consultas en `db/consultas.js`
- `getTeams()`: `SELECT id, name FROM equipos ORDER BY id`.
- `getPlayers(teamID)`: `SELECT j.id, j.name, p.name AS position_name FROM jugadores j JOIN posiciones p ON j.position = p.id WHERE j.id_equipo = $1 ORDER BY j.id`.
- `addTeam(equipo)`: validar `equipo.name`; `INSERT INTO equipos(name) VALUES($1) RETURNING *`.
- `addPlayer({ jugador, teamID })`: validar `jugador.name` y `jugador.position`; `INSERT INTO jugadores(id_equipo, name, position) VALUES($1,$2,$3) RETURNING *`.
- Manejar errores con `try/catch` y lanzar mensajes claros.

### 3. Validaciones y respuestas HTTP
- `controllers/equipos.js`: verificar body con `name`, responder `400` si falta, `201` si crea, `500` en errores.
- `controllers/jugadores.js`: verificar `teamID` numérico, body con `name` y `position` válido, responder `400/404` según corresponda, `201` si crea.
- Asegurar `res.json` consistente en éxito y error.

### 4. Opcional según PDF: JWT
- Si el PDF exige autenticación, usar `jsonwebtoken` y `utils.secretKey` (`utils.js`:1-3) para proteger rutas con middleware.

### 5. Pruebas con Jest y Supertest
- Crear pruebas de integración para cada endpoint: casos de éxito y error.
- Arrancar app en tests con `supertest` sin puerto real.
- Sembrar datos mínimos o usar transacciones para aislar.

### 6. Verificación manual
- Levantar servidor y probar con Thunder Client usando `thunder-collection_Futscript.json`.
- Comprobar flujos: crear equipo, listar equipos, crear jugador en equipo, listar jugadores.

## Entregables
- `db/consultas.js` completo y robusto.
- Respuestas HTTP y validaciones en controladores.
- Suite de tests que pasa con `npm test`.
- Instrucciones de ejecución breves.

## Nota sobre el PDF
- El plan cubre los requerimientos típicos que se reflejan en el código base. Si el PDF define reglas adicionales (formato de respuesta, auth obligatoria, códigos específicos), se ajustará en la implementación inmediatamente tras su confirmación.