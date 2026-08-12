# Backend - Centro Psicológico Centenario

## 🆕 FASE 1 COMPLETADA ✅

### 🔒 1. Variables de Entorno

**Archivo creado:** `.env` y `.env.example`

**Cambio en `index.js` (línea 13):**
```javascript
// Antes (INSEGURO):
const SECRET_KEY = "123456";

// Ahora (SEGURO):
const SECRET_KEY = process.env.JWT_SECRET || 'fallback_secret_CHANGE_THIS';
```

**Configuración necesaria:**
1. Copia `.env.example` a `.env`
2. Completa todas las variables con tus valores reales
3. **NUNCA** commitees el archivo `.env` a Git

### 📄 2. Base de Datos PostgreSQL

**Archivos creados:**
- `config/database.js` - Configuración y pool de conexiones

Las tablas las crea Sequelize automáticamente al arrancar el servidor
(`sequelize.sync()` en `index.js`), leyendo los modelos de `models/`.
No hay que correr ninguna migración SQL a mano para las tablas base.

En producción se usa Neon (PostgreSQL serverless) via la variable
`DATABASE_URL`. Como el sync corre con `alter: false`, los cambios de
columnas que se agreguen a futuro a un modelo SI requieren un
`ALTER TABLE` manual en el SQL editor de Neon (no se generan solos).

### 📦 3. Modelos Creados

**Archivos creados:**
- `models/Profesional.js` - Modelo de profesionales
- `models/Reserva.js` - Modelo de reservas
- `models/Usuario.js` - Modelo de usuarios (admin)

**Estructura de tablas:**

#### Tabla: `usuarios`
- `id` (SERIAL, PK)
- `nombre` (VARCHAR)
- `email` (VARCHAR, UNIQUE)
- `password_hash` (VARCHAR)
- `rol` (VARCHAR, default: 'admin')
- `activo` (BOOLEAN)
- `created_at`, `updated_at` (TIMESTAMP)

#### Tabla: `profesionales`
- `id` (SERIAL, PK)
- `nombre`, `apellido` (VARCHAR)
- `especialidad`, `telefono`, `email` (VARCHAR)
- `descripcion` (TEXT)
- `titulo`, `foto_url`, `cv_url` (VARCHAR)
- `activo` (BOOLEAN)
- `created_at`, `updated_at` (TIMESTAMP)

#### Tabla: `servicios`
- `id` (SERIAL, PK)
- `profesional_id` (FK a profesionales)
- `nombre`, `descripcion` (VARCHAR, TEXT)
- `duracion_minutos` (INTEGER)
- `precio` (DECIMAL)
- `activo` (BOOLEAN)
- `created_at`, `updated_at` (TIMESTAMP)

#### Tabla: `reservas`
- `id` (SERIAL, PK)
- `profesional_id` (FK a profesionales)
- `servicio_id` (FK a servicios)
- `cliente_nombre`, `cliente_email`, `cliente_telefono` (VARCHAR)
- `fecha` (DATE)
- `hora` (TIME)
- `estado` (VARCHAR: pendiente/confirmada/cancelada/completada)
- `notas` (TEXT)
- `created_at`, `updated_at` (TIMESTAMP)

### 💡 Uso de Modelos

**Ejemplo - Obtener todos los profesionales:**
```javascript
const Profesional = require('./models/Profesional');

app.get('/api/profesionales', async (req, res) => {
  try {
    const profesionales = await Profesional.findAll();
    res.json(profesionales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Ejemplo - Crear una reserva:**
```javascript
const Reserva = require('./models/Reserva');

app.post('/api/reservas', async (req, res) => {
  try {
    const reserva = await Reserva.create(req.body);
    res.status(201).json(reserva);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## ⚠️ Próximos Pasos (FASE 2)

- [ ] Refactorizar index.js a arquitectura MVC
  - [ ] Crear carpeta `routes/` con rutas separadas
  - [ ] Crear carpeta `controllers/` con lógica de negocio
  - [ ] Crear carpeta `middlewares/` para autenticación y validaciones
- [ ] Agregar validaciones con `express-validator`
- [ ] Implementar manejo de errores centralizado
- [ ] Configurar CORS específicamente

## 📘 Scripts Útiles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Iniciar servidor de producción
npm start

# Conectarse a PostgreSQL
psql -U usuario -d centro_psicologico

# Ver estructura de una tabla
\d+ nombre_tabla

# Ver todas las tablas
\dt

# Salir de psql
\q
```

## 🔗 Referencias

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [node-postgres (pg)](https://node-postgres.com/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [Express.js](https://expressjs.com/)


---

# 🔥 FASE 2: ARQUITECTURA MVC (EN PROGRESO)

## ✅ Completado Hasta Ahora

### 1. Estructura de Carpetas
```
backend/
├── config/          ✅ Configuración DB
├── controllers/     🚧 Controladores
├── middlewares/     ✅ Auth, Validación, Errores  
├── models/          ✅ Profesional, Reserva, Usuario
├── routes/          🚧 Rutas separadas
├── utils/           🚧 Utilidades
└── migrations/      ✅ Scripts SQL
```

### 2. Middlewares Creados

#### `middlewares/errorHandler.js` ✅
- Manejo centralizado de errores
- Diferentes tipos: validación, DB, auth
- Stack trace en desarrollo

#### `middlewares/auth.js` ✅
- Verificación de JWT
- Protección de rutas
- Control de roles (admin)

#### `middlewares/validate.js` ✅
- Validación con express-validator
- Mensajes de error claros

### 3. Dependencias Instaladas
```bash
✅ pg (PostgreSQL driver)
✅ bcrypt (Password hashing)
✅ express-validator (Validaciones)
```

## 🛠️ Uso de Middlewares

### Ejemplo: Ruta Protegida con Validación
```javascript
const { authMiddleware, checkRole } = require('./middlewares/auth');
const { body } = require('express-validator');
const validate = require('./middlewares/validate');

// Ruta pública
app.get('/api/profesionales', profesionalesController.getAll);

// Ruta protegida (solo autenticados)
app.post('/api/reservas',
  authMiddleware,
  [
    body('cliente_nombre').notEmpty().withMessage('Nombre requerido'),
    body('cliente_email').isEmail().withMessage('Email inválido'),
    body('fecha').isDate().withMessage('Fecha inválida')
  ],
  validate,
  reservasController.create
);

// Ruta solo para admins
app.put('/api/profesionales/:id',
  authMiddleware,
  checkRole('admin'),
  profesionalesController.update
);
```

### Ejemplo: Manejo de Errores
```javascript
// Al final de index.js, DESPUÉS de todas las rutas
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);
```

## 📋 Próximos Pasos

- [ ] Crear controladores (profesionales, reservas, auth)
- [ ] Crear rutas separadas por recurso
- [ ] Migrar endpoints actuales del index.js
- [ ] Configurar CORS específicamente
- [ ] Testing de endpoints

