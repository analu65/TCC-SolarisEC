const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 8081;

app.use(cors());
app.use(express.json());

app.post('/', async (req, res) => {
  console.log('📨 Recebendo solicitação de email...');
  console.log('Para:', req.body.to);
  console.log('Assunto:', req.body.subject);

  try {
    // ⚡ CONFIGURAÇÃO SMTP SIMPLES
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'seu_email@gmail.com', // 👈 SEU EMAIL AQUI
        pass: 'sua_senha_de_app'     // 👈 SUA SENHA DE APP AQUI
      },
    });

    const mailOptions = {
      from: `Solaris EC <seu_email@gmail.com>`, // 👈 MESMO EMAIL AQUI
      to: req.body.to,
      subject: req.body.subject,
      text: req.body.text,
      html: req.body.html
    };

    const result = await transport.sendMail(mailOptions);
    console.log('✅ Email enviado com sucesso!');
    
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
  res.json({ message: 'Servidor de emails rodando!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});