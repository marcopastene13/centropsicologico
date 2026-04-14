# Guia de Deploy - Centro Psicologico Centenario

## FRONTEND → Vercel

1. Conectar repositorio GitHub a Vercel
2. Configurar:
   - Root Directory: `centro-psicologico`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Agregar Variable de Entorno en Vercel:
   - `VITE_API_URL` = `https://TU-BACKEND.render.com/api`

## BACKEND → Render (o Railway)

1. Crear nuevo Web Service en Render
2. Root Directory: `centro-psicologico/backend`
3. Build Command: `npm install`
4. Start Command: `node index.js`
5. Agregar Variables de Entorno:

```
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://TU-APP.vercel.app
JWT_SECRET=una_clave_secreta_larga_y_segura
CALLMEBOT_API_KEY=tu_api_key_de_callmebot
DOCTOR_PHONE=+569XXXXXXXX
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_contraseña_de_aplicacion_gmail
```

## CALLMEBOT (WhatsApp gratuito)

Para activar WhatsApp en cada numero receptor:
1. Cada doctora debe enviar el mensaje exacto al numero +34 644 36 83 13 por WhatsApp:
   `I allow callmebot to send me messages`
2. Recibirán su API key personal
3. Copiar esa API key en la variable CALLMEBOT_API_KEY del backend

## NOTA SOBRE BASE DE DATOS

Actualmente usa SQLite (archivo local). Para produccion real,
migrar a PostgreSQL (gratuito en Neon.tech o Railway):
1. Crear DB en neon.tech
2. Cambiar el config de Sequelize en backend/config/database.js
3. Agregar DATABASE_URL a las variables de entorno de Render
