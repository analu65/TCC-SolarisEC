const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {google} = require("googleapis");

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

const oauth2Client = new google.auth.OAuth2(
    functions.config().gmail.client_id,
    functions.config().gmail.client_secret,
    functions.config().gmail.redirect_uri,
);

oauth2Client.setCredentials({
  refresh_token: functions.config().gmail.refresh_token,
});

const gmail = google.gmail({version: "v1", auth: oauth2Client});
const USER_EMAIL = "analuciacesario910@gmail.com";

function createEmailRaw(to, subject, html, from) {
  const email = [
    `From: ${from}`,
    `To: ${to}`,
    "Content-Type: text/html; charset=utf-8",
    "MIME-Version: 1.0",
    `Subject: ${subject}`,
    "",
    html,
  ].join("\n");

  return Buffer.from(email).toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
}

// 🔹 Versão onCall (sem CORS)
exports.sendBulkEmails = functions.https.onCall(async (data, context) => { // tira o cors
  const {assunto, mensagem, emails, imagemUrl} = data;

  if (!assunto || !mensagem || !emails || !Array.isArray(emails)) {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "Dados inválidos. Necessário: assunto, mensagem e lista de emails",
    );
  }

  let sucessos = 0;
  let erros = 0;
  const resultados = [];

  try {
    const emailRef = db.collection("emails_enviados").doc();
    await emailRef.set({
      assunto,
      mensagem,
      destinatarios: emails.map((e) => e.email),
      totalDestinatarios: emails.length,
      dataEnvio: admin.firestore.FieldValue.serverTimestamp(),
      status: "enviando",
      imagemUrl: imagemUrl || null,
    });

    const htmlTemplate = `<!DOCTYPE html>
      <html><head><meta charset="UTF-8"></head>
      <body>
        <h2>📧 Comunicação Solaris</h2>
        <p>Olá, <strong>{{nome}}</strong>!</p>
        <div>{{mensagem}}</div>
        {{imagem}}
        <p>Atenciosamente,<br>Solaris Escola de Circo</p>
      </body>
      </html>`;

    for (let i = 0; i < emails.length; i++) {
      const {email, name} = emails[i];
      try {
        let htmlPersonalizado = htmlTemplate
            .replace("{{nome}}", name || "Estudante")
            .replace("{{mensagem}}", mensagem.replace(/\n/g, "<br>"));

        if (imagemUrl) {
          htmlPersonalizado = htmlPersonalizado.replace(
              "{{imagem}}",
              `<img src="${imagemUrl}" alt="Imagem" style="max-width:100%"/>`,
          );
        } else {
          htmlPersonalizado = htmlPersonalizado.replace("{{imagem}}", "");
        }

        const raw = createEmailRaw(email, assunto, htmlPersonalizado, USER_EMAIL);

        await gmail.users.messages.send({
          userId: "me",
          resource: {raw},
        });

        sucessos++;
        resultados.push({email, status: "sucesso"});
      } catch (err) {
        erros++;
        resultados.push({email, status: "erro", error: err.message});
      }
    }

    await emailRef.update({
      status: "concluído",
      sucessos,
      erros,
      resultados,
    });

    return {sucessos, erros, resultados, emailId: emailRef.id};
  } catch (err) {
    throw new functions.https.HttpsError("internal", err.message, err);
  }
});
