const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
const { google } = require('googleapis');

// Inicializar Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Configuração OAuth2 para Gmail
const oauth2Client = new google.auth.OAuth2(
  functions.config().gmail.client_id,
  functions.config().gmail.client_secret,
  functions.config().gmail.redirect_url
);

// Definir refresh token
oauth2Client.setCredentials({
  refresh_token: functions.config().gmail.refresh_token
});

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
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

    const { assunto, mensagem, emails, imagemUrl } = req.body; // Adicionado imagemUrl

    if (!assunto || !mensagem || !emails || !Array.isArray(emails)) {
      return res.status(400).json({
        error: 'Dados inválidos. Necessário: assunto, mensagem e lista de emails'
      });
    }

    let sucessos = 0;
    let erros = 0;
    const resultados = [];

    try {
      // Verificar autenticação Gmail
      try {
        await oauth2Client.getAccessToken();
      } catch (authError) {
        console.error('Erro de autenticação Gmail:', authError);
        return res.status(500).json({ 
          error: 'Erro de autenticação Gmail. Verifique as configurações.' 
        });
      }

      // Criar documento no Firestore
      const emailRef = db.collection('emails_enviados').doc();
      await emailRef.set({
        assunto: assunto,
        mensagem: mensagem,
        imagemUrl: imagemUrl || null,
        destinatarios: emails.map(e => e.email),
        totalDestinatarios: emails.length,
        dataEnvio: admin.firestore.FieldValue.serverTimestamp(),
        status: 'enviando'
      });

      // Template HTML atualizado para incluir imagem
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
                                  white-space: pre-wrap;
                              }
                              .email-image {
                                  max-width: 100%;
                                  height: auto;
                                  border-radius: 8px;
                                  margin: 20px 0;
                                  display: block;
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
                                  
                                  {{imagem}}
                                  
                                  <p>Atenciosamente,<br>Solaris Escola de Circo</p>
                              </div>
                              
                              <div class="footer">
                                  <p>Este é um email automático</p>
                              </div>
                          </div>
                      </body>
                      </html>`;

      // Processar imagem no template
      const imagemHtml = imagemUrl ? 
        `<img src="${imagemUrl}" alt="Imagem do email" class="email-image" />` : '';

      for (let i = 0; i < emails.length; i++) {
        const { email, name } = emails[i];
        
        // Validar email
        if (!email || !email.includes('@')) {
          erros++;
          resultados.push({
            email: email || 'email inválido',
            status: 'erro',
            error: 'Email inválido',
            timestamp: new Date().toISOString()
          });
          continue;
        }

        try {
          const htmlPersonalizado = htmlTemplate
            .replace('{{nome}}', name || 'Estudante')
            .replace('{{mensagem}}', mensagem)
            .replace('{{imagem}}', imagemHtml);

          const raw = createEmailRaw(
            email,
            assunto,
            htmlPersonalizado,
            USER_EMAIL
          );

          await gmail.users.messages.send({
            userId: 'me',
            resource: { raw }
          });

          sucessos++;
          resultados.push({ 
            email, 
            status: 'sucesso', 
            timestamp: new Date().toISOString() 
          });

          console.log(`Email enviado com sucesso para: ${email}`);

          // Delay entre envios para evitar rate limit
          if (i < emails.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }

        } catch (emailError) {
          console.error(`Erro ao enviar email para ${email}:`, emailError);
          erros++;
          resultados.push({
            email,
            status: 'erro',
            error: emailError.message || 'Erro desconhecido',
            timestamp: new Date().toISOString()
          });
        }
      }

      // Atualizar documento no Firestore
      await emailRef.update({
        status: 'concluído',
        sucessos: sucessos,
        erros: erros,
        resultados: resultados,
        dataFinalizacao: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log(`Processo concluído: ${sucessos} sucessos, ${erros} erros`);

      return res.json({ 
        success: true,
        sucessos, 
        erros, 
        resultados,
        emailId: emailRef.id,
        message: `Emails processados: ${sucessos} sucessos, ${erros} erros`
      });

    } catch (err) {
      console.error('Erro geral no envio de emails:', err);
      
      // Tentar atualizar o documento com erro se foi criado
      try {
        if (emailRef) {
          await emailRef.update({
            status: 'erro',
            erro: err.message,
            dataFinalizacao: admin.firestore.FieldValue.serverTimestamp()
          });
        }
      } catch (updateError) {
        console.error('Erro ao atualizar documento:', updateError);
      }
      
      return res.status(500).json({ 
        success: false,
        error: 'Erro interno no servidor de emails.',
        details: err.message 
      });
    }
  });
});