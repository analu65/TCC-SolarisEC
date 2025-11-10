import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs, doc, serverTimestamp, addDoc } from 'firebase/firestore';
import { db } from '../controller/controller';
//comentar mais algumas linhas la embaixo

export default function App() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  useEffect(() => {
    BuscarEmailsDoFirebase(); //vai sempre buscar os emails com a funcao de buscar
  }, []);

  const BuscarEmailsDoFirebase = async () => {
    try {
      const usersRef = collection(db, 'users'); //pega o banco de dados e os usuarios p buscar as informacoes
      const snapshot = await getDocs(usersRef); //pega os usuarios
      const emailsList = []; //cria uma lista com os emails dos usuarios

      snapshot.forEach(doc => { //faz para cada um
        const userData = doc.data();
        if (userData.email) { //se existir email com o usuario
          emailsList.push({ //coloca o nome email e id do usuario na lista dos emails criada
            email: userData.email,
            name: userData.nome,
            id: doc.id
          });
        }
      });
      
      setUsuarios(emailsList); //usuarios vira a emaillist que contem as informacoes dos usuarios
      
    } catch (error) { //mensagem de erro se nao der certo carregar os emails
      Alert.alert('Erro', 'Não foi possível carregar os emails dos usuários');
    }
  };

  const emailsTodos = () => {
    if (usuarios.length === 0) {
      return (
        <View style={styles.noRecipientsContainer}>
          <Text style={styles.noRecipients}>Nenhum destinatário encontrado</Text>
        </View>
      );
    }

      return usuarios.map((usuario) => (
      <View key={usuario.id} style={styles.recipientItem}>
        <Ionicons name="person-circle-outline" size={20} color="#dd6b70" /> 
        <Text style={styles.recipientText}>{usuario.email}</Text>
      </View>
    ));
  };

  const enviarEmails = async () => { 
    if (!subject.trim() || !body.trim()) { //se nao tiver assunto e mensagem
      Alert.alert('Atenção', 'Preencha o assunto e a mensagem'); //mostra essa mensagem com o alert
      return;
    }
    
    await executarEnvioDeEmails();
  };

  const executarEnvioDeEmails = async () => {
    
    try {
      let sucessos = 0; //contador de sucessos para analisar com o de erros e ver se algum email nao foi enviado
      let erros = 0; //contador de erros

      for (const usuario of usuarios) { //para cada usuario dos usuarios
        try {
          const enviadoComSucesso = await enviarEmailIndividual(usuario);
          
          if (enviadoComSucesso) {
            sucessos++; //se for enviado conta mais um sucesso
          } else {
            erros++; //se nao foi enviado conta um erro
          }
          
          //pausa entre os emails
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (error) {
          erros++; //se pegar um erro adiciona mais um erro no contador
        }
      }
      await SalvarEmailnoFirebase(sucessos, erros);
      Alert.alert( //quando enviar aparece o alerta com a mensagem de email enviado
        'Envio Concluído', 
        `Emails enviados com sucesso!\n\nEnviados: ${sucessos}\nFalhas: ${erros}`, //aparece o numero de erros e sucessos pra checar se todos foram enviados
      );

    } catch (error) { //se tiver um erro na hora de executar os emails aparece o alert
      
      Alert.alert('Erro', 'Erro durante o envio dos emails');
    }
  };

  const SalvarEmailnoFirebase = async (sucessos, erros) => {
    const emailRef = collection(db, 'sent_emails');

    if (!subject || !body) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos!');
      return;
    } try {

      await addDoc(emailRef, {
        subject: subject,
        body: body,
        sucessos: sucessos,
        erros: erros,
        dataEnvio: serverTimestamp(),
      });
      console.log('Emails enviados ao Banco.');
    } catch (error){
      console.log('Ocorreu um erro ao enviar os emails ao Banco de dados' +error.message);
    }
  };

  const enviarEmailIndividual = async (usuario) => {
    try {
      const response = await fetch('http://localhost:3001/send-email', { //meu servidor
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: usuario.email, 
          subject: subject,
          text: `Olá ${usuario.name},\n\n${body}`, //texto e html bonitinho do email que aparece no gmail
          html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg,rgb(255, 160, 165),rgb(255, 162, 166)); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0;">Solaris Escola de Circo</h1>
            </div>
            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="color: #333;">${subject}</h2>
              <p><strong>Olá ${usuario.name}!</strong></p>
              
              <div style="background-color: #f9f9f9; padding: 20px; border: 2px solid #dd6b70; margin: 20px 0; border-radius: 4px;">
                ${body.replace(/\n/g, '<br>')}
              </div>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            </div>
          </div>
        `
        })
      });

      const data = await response.json();
      return data.success;
      
    } catch (error) {
      console.log('Erro ao enviar email:' + error.message);
      return false;
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Ionicons name="mail-outline" size={24} color="#dd6b70" />
          <Text style={styles.tituloemail}>Enviar Email</Text>
        </View>

        {/* Card de informações */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={20} color="#666" />
            <Text style={styles.infoText}>{usuarios.length} destinatários do sistema</Text>
          </View>
        </View>

        {/* Lista de destinatários */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Destinatários</Text>
          <View style={styles.recipientsList}>
            {emailsTodos()}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Assunto</Text>
          <TextInput
            style={styles.input}
            value={subject}
            onChangeText={setSubject}
            placeholder="Digite o assunto do email..."
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mensagem</Text>
          <TextInput
            style={[styles.input, styles.messageInput]}
            value={body}
            onChangeText={setBody}
            placeholder="Digite sua mensagem aqui..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={8}
            textAlignVertical="top"
          />
          <View style={styles.charCountContainer}>
            <Text style={styles.charcontador}>{body.length}/1000</Text>
          </View>
        </View>
        
        <View style={styles.botaocontainer}>
          <TouchableOpacity 
            style={styles.botaoenviar}
            onPress={enviarEmails}>
            <Ionicons name="send-outline" size={20} color="white" />
            <Text style={styles.botaoenviartexto}>Enviar</Text>
          </TouchableOpacity>
        </View>

        <StatusBar style="auto" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF9F7',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tituloemail: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  messageInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  charCountContainer: {
    alignItems: 'flex-end',
    marginTop: 5,
  },
  charcontador: {
    color: '#999',
    fontSize: 12,
  },
  recipientsList: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  recipientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recipientText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  noRecipientsContainer: {
    padding: 15,
    alignItems: 'center',
  },
  noRecipients: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
  },
  botaocontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  botaoenviar: {
    backgroundColor: '#dd6b70',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
  },
  botaoenviartexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});