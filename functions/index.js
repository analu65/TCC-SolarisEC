const {setGlobalOptions} = require("firebase-functions/v2");
const {onCall} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const nodemailer = require("nodemailer");

setGlobalOptions({maxInstances: 10});


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "analuciacesario910@gmail.com", 
    pass: "xufk exch ttsa cwoo",
  },
});

//fumcao
exports.sendBulkEmails = onCall(async (request) => {
  const {assunto, mensagem, imagemUrl, emails} = request.data;

  logger.info("📧 Iniciando envio de emails", {assunto, total: emails.length});

  let sucessos = 0;
  let erros = 0;

  for (const u of emails) {
    try {
      await transporter.sendMail({
        from: `"Solaris" <analuciacesario910@gmail.com>`,
        to: u.email,
        subject: assunto,
        html: `
          <h2>Olá, ${u.name}!</h2>
          <p>${mensagem}</p>
          ${imagemUrl ? `<img src="${imagemUrl}" alt="Imagem" style="max-width:100%"/>` : ""}
        `,
      });

      sucessos++;
      logger.info(`✅ Email enviado para ${u.email}`);
    } catch (err) {
      erros++;
      logger.error(`❌ Erro ao enviar para ${u.email}`, err);
    }
  }

  logger.info("📊 Envio finalizado", {sucessos, erros});

  return {sucessos, erros};
});
