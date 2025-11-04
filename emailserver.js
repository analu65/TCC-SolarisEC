//ver se tem como o botao do enviar ter duas funcoes na hora de enviar,
// uma pra\ enviar e uma pra salvar no firebase, 
// ai so faz igual os outros ali em cima nas funcoes 
// e dps salvva os emails igual os nomes do firebase q ja tao feitos do express
//from, to, subject, text
//e depois so joga as informacoes num card dentro do avisos do aluno

const express = require('express'); //importa o express
const nodemailer = require('nodemailer'); //usei o nodemailer ao inves da google api para evitar os conflitos de chaves 
const cors = require('cors'); //pram melhorar o problema do localhost 

const app = express(); //cria nova aplicacao do express p usar os metodos depois
const PORT = 3001; //mudei pra 3001 a porta (lembra)

app.use(cors()); //p todas as requisicoes q chegarem (o app eh o express) usa o cors p nao dar problema
app.use(express.json()); //transforma o json em objeto p usar no codigo


//ver se da de tirar depois
app.get('/', (req, res) => { //quando abrir a pagina inicial que eh o / aparece essa mensagem dizendo que o servidor ta funcionando
  res.json({ 
    message: 'servidor de emails funcionando!',
  });
});

// rota para enviar emails (tirei os debugs pra nao me confundir)
app.post('/send-email', async (req, res) => {
  try {
    const { to, subject, text, html } = req.body; //pega essas informacoes da tela de email depois que vou digitar essas informacoes e transforma no body da requisicao

    console.log('Destinatário:', to); //deixa mensagem no console pra conferir se esta certo
    console.log('Assunto:', subject);

    const transport = nodemailer.createTransport({ //cria conexao com  o email
      service: 'gmail',
      auth: { //autenticacao com meu email e a senha de app
        user: 'analuciacesario910@gmail.com', 
        pass: 'khci kqph ueri eufs'
      }
    });

    const infoEmail = { //junta as informacoes do email com os campos pra enviar
      from: 'analuciacesario910@gmail.com', 
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    console.log('enviando email...'); //mostra no console para mostrar se ta enviando
    const resultado = await transport.sendMail(infoEmail); //envia o email
    
    console.log('Email enviado com sucesso.'); //mensagem que o email foi enviado
    console.log('Message ID:', resultado.messageId);
    
    res.json({ 
      success: true, //json pra checar depois o status
      messageId: resultado.messageId,
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
  console.log(`rodando ${PORT}`); //porta que ta rodando
});