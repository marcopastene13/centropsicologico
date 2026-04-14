# Guia de Deploy - Centro Psicologico Centenario

## STACK DE PRODUCCION
- Frontend: React + Vite -> Vercel
- Backend: Node.js + Express -> Render
- Base de Datos: PostgreSQL -> Neon.tech (gratuito)

---

## PASO 1 - Crear base de datos PostgreSQL en Neon.tech

1. Ir a https://neon.tech y crear cuenta gratuita
2. Crear nuevo proyecto: "centropsicologico"
3. Copiar la 'Connection string' que tiene formato:
   postgresql://user:password@host/dbname?sslmode=require
4. Guardar esta URL para usarla en el paso 3

---

## PASO 2 - Deploy del Backend en Render

1. Ir a https://render.com y crear cuenta
2. New > Web Service > conectar repositorio GitHub
3. Configurar:
   - Root Directory: centro-psicologico/backend
   - Build Command: npm install
   - Start Command: node index.js
4. Agregar Variables de Entorno:

```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
FRONTEND_URL=https://TU-APP.vercel.app
JWT_SECRET=una_clave_secreta_muy_larga_y_segura_minimo_32_caracteres
CALLMEBOT_API_KEY=tu_api_key_de_callmebot
DOCTOR_PHONE=+569XXXXXXXX
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_contrasena_de_aplicacion_gmail
EMAIL_FROM=Centro Psicologico Centenario <noreply@centropsicologico.cl>
```

5. Deploy! Sequelize creara las tablas automaticamente al iniciar

---

## PASO 3 - Deploy del Frontend en Vercel

1. Ir a https://vercel.com y crear cuenta (o usar existente)
2. New Project > importar repositorio GitHub
3. Configurar:
   - Root Directory: centro-psicologico
   - Framework Preset: Vite
   - Build Command: npm run build
   - Output Directory: dist
4. Agregar Variable de Entorno:
   - VITE_API_URL = https://TU-BACKEND.render.com/api
5. Deploy!

---

## PASO 4 - Activar WhatsApp con CallMeBot

Cada numero que recibira notificaciones debe activarse:
1. Enviar desde el WhatsApp del numero receptor al +34 644 36 83 13:
   I allow callmebot to send me messages
2. Recibirán una API key personal
3. Pegar esa API key en CALLMEBOT_API_KEY en Render

Nota: Es una API key por numero. Si hay multiples doctoras,
cada una debe activar su numero individualmente.

---

## NOTAS TECNICAS

### Base de datos
- Desarrollo local: SQLite automatico (no requiere configuracion)
- Produccion: PostgreSQL via DATABASE_URL
- Sequelize detecta el entorno automaticamente por la presencia de DATABASE_URL
- Las tablas se crean con sync({ alter: true }) al iniciar el servidor

### CORS
- Desarrollo: localhost:5173, localhost:3000, *.github.dev
- Produccion: se agrega automaticamente el valor de FRONTEND_URL

### SSL
- El cliente PostgreSQL tiene rejectUnauthorized: false
- Compatible con Neon, Railway, Supabase, Render PostgreSQL
