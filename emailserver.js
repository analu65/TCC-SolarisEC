const express = require('express');
const nodemailer = require('nodemailer'); //usei o nodemailer ao inves da google api para evitar os conflitos de chaves
const cors = require('cors');

const app = express();
const PORT = 3001; //mudei pra 3001 a porta

app.use(cors());
app.use(express.json());

console.log('🔄 Iniciando servidor...');

//ver se da de tirar depois
app.get('/', (req, res) => {
  console.log('Rota / acessada');
  res.json({ 
    message: 'Servidor de emails funcionando!',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// rota para enviar emails (tirei os debugs pra nao me confundir)
app.post('/send-email', async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;

    console.log('Destinatário:', to);
    console.log('Assunto:', subject);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'analuciacesario910@gmail.com', 
        pass: 'khci kqph ueri eufs'
      }
    });

    const mailOptions = {
      from: 'analuciacesario910@gmail.com', 
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    console.log('Enviando email...'); //mostra no console para mostrar se ta enviando
    const result = await transporter.sendMail(mailOptions);
    
    console.log('Email enviado com sucesso.');
    console.log('Message ID:', result.messageId);
    
    res.json({ 
      success: true, //json pra checar depois o status
      messageId: result.messageId,
      status: 'Email enviado'
    });

  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor de emails rodando na porta ${PORT}`); //porta que ta rodando
  console.log(`Teste: http://localhost:${PORT}/`);
  console.log(`Rota de emails: http://localhost:${PORT}/send-email`); 
});