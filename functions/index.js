<<<<<<< Updated upstream
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
=======
/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
>>>>>>> Stashed changes
