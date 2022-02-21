const nodemailer = require("nodemailer");

function enviarMail(destinatarios, asunto, mensaje) {
  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mbensan.test@gmail.com",
      pass: "mbensan.2022",
    },
  });

  const options = {
    from:'mbensan.test@gmail.com',
    to: destinatarios,
    subject: asunto,
    html: mensaje,
  }

  
  transporter.sendMail(options);
}
module.exports = enviarMail;