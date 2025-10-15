const express = require('express');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 8081;

// Middleware
app.use(cors());
app.use(express.json());

// Configuração OAuth2
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

// Rota que seu frontend está chamando
app.post('/', async (req, res) => {
  console.log('📨 Recebendo solicitação de email...');
  console.log('Para:', req.body.to);
  console.log('Assunto:', req.body.subject);

  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER, // SEU email autorizado
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: `Solaris EC <${process.env.GMAIL_USER}>`,
      to: req.body.to,
      subject: req.body.subject,
      text: req.body.text,
      html: req.body.html
    };

    const result = await transport.sendMail(mailOptions);
    console.log('✅ Email enviado com sucesso!');
    console.log('Message ID:', result.messageId);
    
    res.json({ 
      success: true, 
      message: 'Email enviado com sucesso',
      messageId: result.messageId 
    });
    
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'Servidor de emails rodando! 🚀' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📧 Pronto para receber solicitações de email`);
});


//LEMBRAR: tirar os comentarios e fazer do meu jeito
//o erro de agora é que não configurou a refresh token no .env