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
  
      let sucessos = 0;
      let erros = 0;
      const resultados = [];
  
      try {
        const htmlTemplate = ` ... `;
  
        for (let i = 0; i < emails.length; i++) {
          const { email, name } = emails[i];
          try {
            const htmlPersonalizado = htmlTemplate.replace('{{nome}}', name || 'Estudante');
  
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
            resultados.push({ email, status: 'sucesso', timestamp: new Date().toISOString() });
  
            if (i < emails.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
  
          } catch (emailError) {
            erros++;
            resultados.push({
              email,
              status: 'erro',
              error: emailError.message,
              timestamp: new Date().toISOString()
            });
          }
        }
  
        return res.json({ sucessos, erros, resultados });
  
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro no envio de emails.' });
      }
    });
  });