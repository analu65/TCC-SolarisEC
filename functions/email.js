const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
const { google } = require('googleapis');

// Inicializar Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

const gmail = google.gmail('v1');
const USER_EMAIL = 'analuciacesario910@gmail.com'; 


function createEmailRaw(to, subject, html, from) {
  const email = [
    `From: ${from}`,
    `To: ${to}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${subject}`,
    '',
    html
  ].join('\n');

  return Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
}


exports.sendBulkEmails = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Método não permitido.' });
    }

    const { assunto, mensagem, emails } = req.body;

    if (!assunto || !mensagem || !emails || !Array.isArray(emails)) {
      return res.status(400).json({
        error: 'Dados inválidos. Necessário: assunto, mensagem e lista de emails'
      });
    }

    let sucessos = 0; //conta sucessos e erros
    let erros = 0;
    const resultados = []; //resultados

    try {
      //cria o documento novo no firestore para salvar as informacoes
      const emailRef = db.collection('emails_enviados').doc(); //cria no emails_enviados
      await emailRef.set({
        assunto: assunto,
        mensagem: mensagem,
        destinatarios: emails.map(e => e.email), //pega todas as informacoes com essas funcoes prontas para botas no firestore
        totalDestinatarios: emails.length,
        dataEnvio: admin.firestore.FieldValue.serverTimestamp(),
        status: 'enviando'
      });
      //terminar de arrumar o html depois pra oq eu quiser, mas so depois de tentar enviar p mim
      const htmlTemplate = `<!DOCTYPE html>
                      <html>
                      <head>
                          <meta charset="UTF-8">
                          <style>
                              body {
                                  font-family: Arial, sans-serif;
                                  line-height: 1.6;
                                  color: #333;
                                  max-width: 600px;
                                  margin: 0 auto;
                                  padding: 20px;
                                  background-color: #f5f5f5;
                              }
                              .container {
                                  background: white;
                                  border-radius: 10px;
                                  overflow: hidden;
                                  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                              }
                              .header {
                                  background: linear-gradient(135deg, #dd6b70, #ff8a8e);
                                  padding: 30px;
                                  text-align: center;
                                  color: white;
                              }
                              .content {
                                  padding: 30px;
                              }
                              .message {
                                  background: #f9f9f9;
                                  padding: 20px;
                                  border-left: 4px solid #dd6b70;
                                  margin: 20px 0;
                                  border-radius: 4px;
                              }
                              .footer {
                                  text-align: center;
                                  padding: 20px;
                                  background: #f8f8f8;
                                  color: #666;
                                  font-size: 12px;
                              }
                          </style>
                      </head>
                      <body>
                          <div class="container">
                              <div class="header">
                                  <h1>📧 Comunicação Solaris</h1>
                              </div>
                              
                              <div class="content">
                                  <p>Olá, <strong>{{nome}}</strong>!</p>
                                  
                                  <div class="message">
                                      {{mensagem}}
                                  </div>
                                  
                                  <p>Atenciosamente,<br>Solaris Escola de Circo</p>
                              </div>
                              
                              <div class="footer">
                                  <p>Este é um email automático</p>
                              </div>
                          </div>
                      </body>
                      </html>`;

      for (let i = 0; i < emails.length; i++) { //for pra ir percorrendo os emails
        const { email, name } = emails[i];
        try {
          const htmlPersonalizado = htmlTemplate.replace('{{nome}}', name || 'Estudante');

          const raw = createEmailRaw(
            email,
            assunto,
            htmlPersonalizado, //email
            USER_EMAIL
          );

          await gmail.users.messages.send({
            userId: 'me', 
            resource: { raw }
          });

          sucessos++; //conta os sucessos
          resultados.push({ email, status: 'sucesso', timestamp: new Date().toISOString() });

          if (i < emails.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }

        } catch (emailError) {
          erros++; //conta os erros
          resultados.push({
            email,
            status: 'erro',
            error: emailError.message,
            timestamp: new Date().toISOString()
          });
        }
      }

      //coloca esses resultados no documento do firebase
      await emailRef.update({
        status: 'concluído',
        sucessos: sucessos,
        erros: erros,
        resultados: resultados
      });

      return res.json({ 
        sucessos, 
        erros, 
        resultados,
        emailId: emailRef.id //id do documento 
      });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro no envio de emails.' });
    }
  });
});