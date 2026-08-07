# Backend - Centro Psicológico Centenario
## Arquitectura MVC v2.0

### 🏛️ Estructura del Proyecto

```
backend/
├── config/
│   └── database.js          # Configuración de PostgreSQL/Sequelize
├── controllers/
│   ├── authController.js     # Lógica de autenticación
│   ├── bookingController.js  # Lógica de reservas
│   └── professionalController.js # Lógica de profesionales
├── middlewares/
│   ├── auth.js              # Middleware de autenticación JWT
│   └── validate.js          # Validaciones con express-validator
├── migrations/
│   ├── 001_create_users.js
│   ├── 002_create_professionals.js
│   └── 003_create_bookings.js
├── models/
│   ├── index.js             # Exportación y relaciones
│   ├── Usuario.js
│   ├── Profesional.js
│   └── Reserva.js
├── routes/
│   ├── auth.js              # Rutas de autenticación
│   ├── bookings.js          # Rutas de reservas
│   └── professionals.js     # Rutas de profesionales
├── .env                     # Variables de entorno
├── .env.example
├── index.js                 # Archivo principal (MVC integrado)
├── index.js.backup          # Backup del archivo anterior
├── package.json
└── README_MVC.md            # Este archivo
```

### 🚀 Endpoints API

#### Autenticación (`/api/auth`)
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Ver perfil (protegido)
- `PUT /api/auth/profile` - Actualizar perfil (protegido)
- `PUT /api/auth/change-password` - Cambiar contraseña (protegido)

#### Reservas (`/api/bookings`)
- `GET /api/bookings/available-slots?profesionalId=1&fecha=2026-03-24` - Horas disponibles (público)
- `POST /api/bookings` - Crear reserva (público)
- `GET /api/bookings` - Listar todas las reservas (protegido)
- `GET /api/bookings/:id` - Ver reserva específica (protegido)
- `PUT /api/bookings/:id` - Actualizar reserva (protegido)
- `DELETE /api/bookings/:id` - Cancelar reserva (protegido)

#### Profesionales (`/api/professionals`)
- `GET /api/professionals` - Listar profesionales activos (público)
- `GET /api/professionals/:id` - Ver profesional (público)
- `POST /api/professionals` - Crear profesional (admin)
- `PUT /api/professionals/:id` - Actualizar profesional (admin)
- `DELETE /api/professionals/:id` - Desactivar profesional (admin)

### 📦 Dependencias Instaladas

```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "dotenv": "^16.0.3",
  "sequelize": "^6.35.0",
  "pg": "^8.11.0",
  "pg-hstore": "^2.3.4",
  "bcrypt": "^5.1.1",
  "jsonwebtoken": "^9.0.2",
  "express-validator": "^7.0.1",
  "twilio": "^4.19.0"
}
```

### ⚙️ Variables de Entorno (.env)

```env
# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=centro_psicologico
DB_USER=tu_usuario
DB_PASSWORD=tu_password

# JWT
JWT_SECRET=tu_secret_key_super_seguro

# Twilio (WhatsApp/SMS)
TWILIO_ACCOUNT_SID=tu_account_sid
TWILIO_AUTH_TOKEN=tu_auth_token
TWILIO_PHONE_NUMBER=+56912345678

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_password
EMAIL_FROM=Centro Psicológico <noreply@centropsicologico.cl>

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:5173

# Servidor
PORT=3000
NODE_ENV=development
```

### 📝 Ejemplos de Uso

#### 1. Crear Reserva
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "profesionalId": 1,
    "fecha": "2026-03-25",
    "hora": "10:00",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "telefono": "+56912345678",
    "motivo": "Consulta inicial"
  }'
```

#### 2. Obtener Horas Disponibles
```bash
curl "http://localhost:3000/api/bookings/available-slots?profesionalId=1&fecha=2026-03-25"
```

#### 3. Registrar Usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Ana García",
    "email": "ana@example.com",
    "password": "password123"
  }'
```

#### 4. Iniciar Sesión
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ana@example.com",
    "password": "password123"
  }'
```

### 🔧 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar servidor en modo desarrollo
npm run dev

# Ejecutar servidor en producción
npm start

# Ejecutar migraciones
node migrations/runMigrations.js

# Verificar salud del servidor
curl http://localhost:3000/health
```

### 📊 Cambios Realizados en Fase 2

✅ **Completado:**
1. Arquitectura MVC implementada
2. Controladores creados (auth, booking, professional)
3. Rutas organizadas por recurso
4. Validaciones con express-validator
5. Middleware de autenticación JWT
6. Integración de Twilio para WhatsApp
7. Relaciones entre modelos configuradas
8. Health check endpoint
9. Manejo de errores centralizado
10. Documentación completa

### 📝 Próximos Pasos

1. ☐ Probar todos los endpoints con Postman/Thunder Client
2. ☐ Crear datos de prueba (seeders)
3. ☐ Integrar con el frontend React
4. ☐ Configurar Twilio para notificaciones WhatsApp
5. ☐ Agregar tests unitarios
6. ☐ Documentar con Swagger/OpenAPI
7. ☐ Configurar logs con Winston
8. ☐ Implementar rate limiting

### 🐛 Depuración

El servidor incluye logs detallados:
```
=== GET /api/professionals ===
✅ Conexión a la base de datos establecida exitosamente
✅ Modelos sincronizados con la base de datos
✅ Servidor corriendo en puerto 3000
🌍 Ambiente: development
📡 API disponible en: http://localhost:3000
```

### 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ JWT para autenticación
- ✅ Variables sensibles en .env
- ✅ Validación de inputs
- ✅ CORS configurado
- ✅ SQL injection prevenido (Sequelize ORM)

---

**Versión:** 2.0.0  
**Última actualización:** Marzo 2026  
**Desarrollador:** Marco Pastene
