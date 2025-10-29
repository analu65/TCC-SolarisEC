import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, Button, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../controller/controller';

export default function App() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [email, setEmail] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [totalEmails, setTotalEmails] = useState(0);

  useEffect(() => {
    async function checkAvailability() {
      const isMailAvailable = true; // Como estamos usando servidor próprio, sempre disponível
      setIsAvailable(isMailAvailable);
      BuscarEmailsDoFirebase();
    }

    checkAvailability();
  }, []);

  const BuscarEmailsDoFirebase = async () => {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      const emailsList = [];

      snapshot.forEach(doc => {
        const userData = doc.data();
        if (userData.email) {
          emailsList.push({
            email: userData.email,
            name: userData.nome || 'Usuário',
            id: doc.id
          });
        }
      });
      setUsuarios(emailsList);
      setTotalEmails(emailsList.length);
      // Preenche automaticamente os recipients com os emails do Firebase
      setRecipients(emailsList.map(user => user.email));
    } catch (error) {
      console.error('Erro ao buscar emails', error);
      Alert.alert('Não foi possível carregar os emails dos usuários');
    }
  };

  const addRecipient = () => {
    if (!email || !email.includes('@')) {
      Alert.alert('Email inválido');
      return;
    }

    let newRecipients = [...recipients];
    newRecipients.push(email);
    setRecipients(newRecipients);
    setEmail('');
  };

  const removeRecipient = (indexToRemove) => {
    const newRecipients = recipients.filter((_, index) => index !== indexToRemove);
    setRecipients(newRecipients);
  };

  const showRecipients = () => {
    if (recipients.length === 0) {
      return <Text style={styles.noRecipients}>Nenhum destinatário adicionado</Text>;
    }

    return recipients.map((recipient, index) => (
      <View key={index} style={styles.recipientItem}>
        <Text style={styles.recipientText}>{recipient}</Text>
        <TouchableOpacity onPress={() => removeRecipient(index)}>
          <Ionicons name="close-circle" size={20} color="#dd6b70" />
        </TouchableOpacity>
      </View>
    ));
  };

  const enviarEmails = async () => {
    if (!subject.trim() || !body.trim()) {
      Alert.alert('Preencha o assunto e a mensagem');
      return;
    }
    
    if (recipients.length === 0) {
      Alert.alert('Nenhum destinatário selecionado');
      return;
    }
    
    await executarEnvioDeEmails();
  };

  const executarEnvioDeEmails = async () => {
    console.log('Iniciando envio de emails...');
    setEnviando(true);
    
    try {
      let sucessos = 0;
      let erros = 0;

      for (const recipient of recipients) {
        try {
          const usuario = usuarios.find(user => user.email === recipient) || {
            email: recipient,
            name: 'Cliente'
          };
          
          const enviadoComSucesso = await enviarEmailIndividual(usuario);
          
          if (enviadoComSucesso) {
            sucessos++;
            console.log(`Email enviado para: ${usuario.email}`);
          } else {
            erros++;
            console.log(`Falha no envio para: ${usuario.email}`);
          }
          
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (error) {
          erros++;
          console.log(`Erro para ${recipient}:`, error.message);
        }
      }

      Alert.alert(
        'Resultado do Envio', 
        `Emails enviados com sucesso!\n\nSucessos: ${sucessos}\nErros: ${erros}`,
        [{ text: 'OK', onPress: limparFormulario }]
      );

    } catch (error) {
      console.error('Erro geral:', error);
      Alert.alert('Erro', 'Ocorreu um erro durante o envio dos emails');
    } finally {
      setEnviando(false);
    }
  };

  const enviarEmailIndividual = async (usuario) => {
    try {
      console.log(`Enviando para: ${usuario.email}`);
      
      const response = await fetch('http://localhost:3001/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: usuario.email,
          subject: subject,
          text: `Olá ${usuario.name},\n\n${body}`,
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
  
      // Verifica se a resposta é JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // Se não for JSON, tenta ler como texto para debug
        const textResponse = await response.text();
        console.log('Resposta não-JSON do servidor:', textResponse.substring(0, 200));
        
        // Considera sucesso se o status for 200-299
        return response.ok;
      }
      
      console.log('Resposta do servidor:', data);
      
      // Adapta para diferentes formatos de resposta
      return data.success || data.status === 'success' || response.ok;
      
    } catch (error) {
      console.error(`❌ Erro ao enviar para ${usuario.email}:`, error);
      return false;
    }
  };
  const limparFormulario = () => {
    setSubject('');
    setBody('');
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
            <Ionicons name="mail-outline" size={20} color="#666" />
            <Text style={styles.infoText}>{recipients.length} destinatários selecionados</Text>
          </View>
        </View>

        {/* Adicionar destinatário manualmente */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Adicionar Destinatário</Text>
          <View style={styles.addRecipientContainer}>
            <TextInput
              style={[styles.input, styles.recipientInput]}
              value={email}
              onChangeText={setEmail}
              placeholder="Digite o email..."
              placeholderTextColor="#999"
              keyboardType="email-address"
            />
            <TouchableOpacity style={styles.addButton} onPress={addRecipient}>
              <Ionicons name="add-circle" size={24} color="#dd6b70" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Lista de destinatários */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Destinatários</Text>
          <View style={styles.recipientsList}>
            {showRecipients()}
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
          <Text style={styles.charcontador}>{body.length}/1000</Text>
        </View>
        
        <View style={styles.botaocontainer}>
        <View style={styles.botaocontainer}>
          <TouchableOpacity 
            style={styles.botaoenviar}
            onPress={enviarEmails}
          >
            <Ionicons name="send-outline" size={20} color="white" />
            <Text style={styles.botaoenviartexto}>Enviar Emails</Text>
          </TouchableOpacity>
        </View>
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
  charcontador: {
    textAlign: 'right',
    color: '#999',
    fontSize: 12,
    marginTop: 5,
  },
  addRecipientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipientInput: {
    flex: 1,
    marginRight: 10,
  },
  addButton: {
    padding: 10,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recipientText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  noRecipients: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    padding: 10,
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
  botaoenviardesativado: {
    backgroundColor: '#999',
  },
  botaoenviartexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});