const nodemailer = require('nodemailer');

const sendContact = async (req, res) => {
  try {
    const { nombre, email, telefono, mensaje } = req.body;
    if (!nombre || !email || !telefono || !mensaje) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    // Validaciones
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Correo electronico invalido' });
    }
      const telRegex = /^[+]?[\d\s()-]{7,15}$/;
    if (!telRegex.test(telefono)) {
      return res.status(400).json({ message: 'Telefono invalido' });
    }
    // Si hay config de email, enviar
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      });
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `Contacto Web - ${nombre}`,
        html: `<h3>Nuevo mensaje de contacto</h3>
               <p><b>Nombre:</b> ${nombre}</p>
               <p><b>Email:</b> ${email}</p>
               <p><b>Telefono:</b> ${telefono}</p>
               <p><b>Mensaje:</b> ${mensaje}</p>`
      });
    }
    console.log(`[CONTACTO] ${nombre} | ${email} | ${telefono}`);
    res.json({ message: 'Mensaje enviado exitosamente. Nos contactaremos a la brevedad.' });
  } catch (err) {
    console.error('Error sendContact:', err);
    res.status(500).json({ message: 'Error al enviar el mensaje' });
  }
};

module.exports = { sendContact };