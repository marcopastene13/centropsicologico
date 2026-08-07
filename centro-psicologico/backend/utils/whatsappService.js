const https = require('https');
const querystring = require('querystring');

/**
 * Servicio de WhatsApp usando CallMeBot API (gratuito)
 * Para activar: enviar "I allow callmebot to send me messages" al +34 644 36 83 13
 * Recibiras tu API key por WhatsApp
 *
 * Para Twilio: configurar TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER en .env
 */

const sendCallMeBot = async (phone, message) => {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.CALLMEBOT_API_KEY;
    if (!apiKey || apiKey === 'tu_api_key') {
      console.log('[WhatsApp CallMeBot] API key no configurada. Mensaje simulado a', phone, ':', message);
      resolve({ success: false, simulated: true });
      return;
    }

    // Limpiar el numero de telefono (solo digitos y +)
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    const encodedMessage = encodeURIComponent(message);
    const url = `https://api.callmebot.com/whatsapp.php?phone=${cleanPhone}&text=${encodedMessage}&apikey=${apiKey}`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`[WhatsApp CallMeBot] Enviado a ${cleanPhone}:`, res.statusCode);
        resolve({ success: res.statusCode === 200, response: data });
      });
    }).on('error', (err) => {
      console.error('[WhatsApp CallMeBot] Error:', err.message);
      reject(err);
    });
  });
};

const sendTwilio = async (phone, message) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

  if (!accountSid || accountSid === 'tu_account_sid') {
    console.log('[WhatsApp Twilio] Credenciales no configuradas. Mensaje simulado a', phone, ':', message);
    return { success: false, simulated: true };
  }

  return new Promise((resolve, reject) => {
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    const postData = querystring.stringify({
      From: fromNumber,
      To: `whatsapp:+${cleanPhone.replace('+', '')}`,
      Body: message
    });

    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    const options = {
      hostname: 'api.twilio.com',
      port: 443,
      path: `/2010-04-01/Accounts/${accountSid}/Messages.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': `Basic ${auth}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`[WhatsApp Twilio] Enviado a ${cleanPhone}:`, res.statusCode);
        resolve({ success: res.statusCode === 201, response: JSON.parse(data) });
      });
    });

    req.on('error', (err) => {
      console.error('[WhatsApp Twilio] Error:', err.message);
      reject(err);
    });

    req.write(postData);
    req.end();
  });
};

/**
 * Enviar mensaje WhatsApp - intenta CallMeBot primero, luego Twilio
 */
const sendWhatsApp = async (phone, message) => {
  try {
    // Verificar si Twilio esta configurado
    const twilioConfigured = process.env.TWILIO_ACCOUNT_SID && 
                             process.env.TWILIO_ACCOUNT_SID !== 'tu_account_sid';
    
    const callmebotConfigured = process.env.CALLMEBOT_API_KEY && 
                                process.env.CALLMEBOT_API_KEY !== 'tu_api_key';

    if (twilioConfigured) {
      return await sendTwilio(phone, message);
    } else if (callmebotConfigured) {
      return await sendCallMeBot(phone, message);
    } else {
      console.log('[WhatsApp] Sin credenciales configuradas. Mensaje simulado:');
      console.log(`  Para: ${phone}`);
      console.log(`  Mensaje: ${message}`);
      return { success: false, simulated: true };
    }
  } catch (error) {
    console.error('[WhatsApp] Error al enviar mensaje:', error.message);
    // No lanzar error para no interrumpir el flujo de reserva
    return { success: false, error: error.message };
  }
};

/**
 * Notificar reserva al paciente
 */
const notifyPatient = async (booking, professional) => {
  const { nombrePaciente, telefono, fecha, hora } = booking;
  const message = `Hola ${nombrePaciente}! Tu hora en Centro Psicologico Centenario ha sido confirmada.

Profesional: ${professional.nombre}
Fecha: ${fecha}
Hora: ${hora}

Ante cualquier consulta llamar al +56 9 XXXX XXXX.

Centro Psicologico Centenario`;

  return await sendWhatsApp(telefono, message);
};

/**
 * Notificar reserva al profesional
 */
const notifyProfessional = async (booking, professional) => {
  const { nombrePaciente, fecha, hora, motivo } = booking;
  const doctorPhone = professional.telefono || process.env.DOCTOR_PHONE;
  
  if (!doctorPhone) {
    console.log('[WhatsApp] No hay telefono configurado para el profesional', professional.nombre);
    return { success: false, reason: 'no_phone' };
  }

  const message = `Nueva reserva en Centro Psicologico Centenario!

Paciente: ${nombrePaciente}
Fecha: ${fecha}
Hora: ${hora}
${motivo ? `Motivo: ${motivo}` : ''}

Centro Psicologico Centenario`;

  return await sendWhatsApp(doctorPhone, message);
};

module.exports = {
  sendWhatsApp,
  notifyPatient,
  notifyProfessional
};
