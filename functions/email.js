const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

async function SendMail() {
  try {
    const accessTokenObj = await oAuth2Client.getAccessToken();
    const accessToken = accessTokenObj.token || accessTokenObj; // pega string token ou o objeto inteiro se for string

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'analuciacesario910@gmail.com',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const nome = "João";
    const mensagem = "Esta é uma mensagem de teste.";
    const imagem = '<img src="https://example.com/image.png" alt="Imagem" class="email-image" />';

    const htmlContent = `<!DOCTYPE html>
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
                  <p>Olá, <strong>${nome}</strong>!</p>
                  
                  <div class="message">
                      ${mensagem}
                  </div>
                  
                  ${imagem}
                  
                  <p>Atenciosamente,<br>Solaris Escola de Circo</p>
              </div>
              
              <div class="footer">
                  <p>Este é um email automático</p>
              </div>
          </div>
      </body>
      </html>`;

    const mailOptions = {
      from: 'SENDER NAME <your.authorized.email@gmail.com>',
      to: 'to.email@example.com',
      subject: 'Hello from gmail using API',
      text: `Olá, ${nome}! \n\n${mensagem}\n\nAtenciosamente,\nSolaris Escola de Circo`,
      html: htmlContent,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}

SendMail()
  .then((result) => console.log('Email sent...', result))
  .catch((error) => console.log('Error:', error.message));
