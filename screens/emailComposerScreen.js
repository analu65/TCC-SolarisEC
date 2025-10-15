import { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../controller/controller";
import { Ionicons } from '@expo/vector-icons';

const EmailComposerScreen = () => {
  const [assunto, setAssunto] = useState(''); //assunto, mensagem e enviando pra colocar embaixo depois na const de envio do email
  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [totalEmails, setTotalEmails] = useState(0); //total de emails

  useEffect(() => {
    buscarEmailsDoFirebase(); //const para buscar os emails do firebase
  }, []);

  const buscarEmailsDoFirebase = async () => {
    try {
      const usersRef = collection(db, 'users'); //pega os usuarios do banco db do users
      const snapshot = await getDocs(usersRef); //pega os dados do userref em cima
      const emailsList = [];

      snapshot.forEach(doc => { //pega os dados e se tiver email puxa o email e o nome pra usar depois na telinha que mostra os emails
        const userData = doc.data();
        if (userData.email) {
          emailsList.push({
            email: userData.email,
            name: userData.nome || 'Usuário',
            id: doc.id
          });
        }
      });
      setUsuarios(emailsList); //o setusuarios pega a emailslist
      setTotalEmails(emailsList.length);
    } catch (error) {
      console.error('Erro ao buscar emails', error);
      Alert.alert('Não foi possível carregar os emails dos usuários');
    }
  };

  const enviarEmails = async () => {
    if (!assunto.trim() || !mensagem.trim()) {
      Alert.alert('Preencha o assunto e a mensagem');
      return;
    }
    
    if (usuarios.length === 0) {
      Alert.alert('Nenhum email encontrado no banco de dados');
      return;
    }
    
    await executarEnvioDeEmails();
  };

  const executarEnvioDeEmails = async () => {
    console.log('Iniciando envio de emails...');
    setEnviando(true);
    
    try {
      let sucessos = 0; //conta os sucessos e os erros na hora de mandar
      let erros = 0;

      // envia um email por vez
      for (const usuario of usuarios) {
        try {
          const enviadoComSucesso = await enviarEmailIndividual(usuario);
          
          if (enviadoComSucesso) {
            sucessos++;
            console.log(`Email enviado para: ${usuario.email}`);
          } else {
            erros++;
            console.log(`Falha no envio para: ${usuario.email}`);
          }
          
          await new Promise(resolve => setTimeout(resolve, 500)); // pequena pausa entre os emails para não sobrecarregar
          
        } catch (error) {
          erros++; //adiciona um erro no contador de erros
          console.log(`Erro para ${usuario.email}:`, error.message); //mostra se tiver erro e o usuario q deu erro
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
      console.log(`📤 Enviando para: ${usuario.email}`);
      
      const response = await fetch('http://localhost:8081/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: usuario.email,
          subject: assunto,
          text: `Olá ${usuario.name},\n\n${mensagem}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #dd6b70, #ff8a8e); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0;">📧 Solaris EC</h1>
              </div>
              <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="color: #333;">${assunto}</h2>
                <p><strong>Olá ${usuario.name}!</strong></p>
                <div style="background-color: #f9f9f9; padding: 20px; border-left: 4px solid #dd6b70; margin: 20px 0; border-radius: 4px;">
                  ${mensagem.replace(/\n/g, '<br>')}
                </div>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="color: #666; font-size: 12px; text-align: center;">
                  Este email foi enviado automaticamente pela Solaris Escola de Circo
                </p>
              </div>
            </div>
          `
        })
      });
  
      const data = await response.json();
      console.log('Resposta do servidor:', data);
      
      return data.success;
      
    } catch (error) {
      console.error(`❌ Erro ao enviar para ${usuario.email}:`, error);
      return false;
    }
  };
  const limparFormulario = () => {
    setAssunto('');
    setMensagem('');
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
            <Text style={styles.infoText}>{totalEmails} destinatários</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
            <Text style={styles.infoText}>Pronto para enviar</Text>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Assunto</Text>
          <TextInput
            style={styles.input}
            value={assunto}
            onChangeText={setAssunto}
            placeholder="Digite o assunto do email..."
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mensagem</Text>
          <TextInput
            style={[styles.input, styles.messageInput]}
            value={mensagem}
            onChangeText={setMensagem}
            placeholder="Digite sua mensagem aqui..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={8}
            textAlignVertical="top"
          />
          <Text style={styles.charcontador}>{mensagem.length}/1000</Text>
        </View>
        
        {/* Botão Enviar */}
        <View style={styles.botaocontainer}>
          <TouchableOpacity 
            style={[styles.botaoenviar, enviando && styles.botaoenviardesativado]}
            onPress={enviarEmails}
            disabled={enviando}
          >
            {enviando ? (
              <>
                <ActivityIndicator color="white" size="small" />
                <Text style={styles.botaoenviartexto}>Enviando...</Text>
              </>
            ) : (
              <>
                <Ionicons name="send-outline" size={20} color="white" />
                <Text style={styles.botaoenviartexto}>Enviar Emails</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Preview de destinatários */}
        <View style={styles.emailPreview}>
          <Text style={styles.previewTitle}>Lista de destinatários:</Text>
          {usuarios.slice(0, 3).map((user, index) => (
            <View key={user.id} style={styles.emailItem}>
              <Ionicons name="person-outline" size={16} color="#666" />
              <Text style={styles.emailText}>{user.name} - {user.email}</Text>
            </View>
          ))}
          {usuarios.length > 3 && (
            <Text style={styles.moreEmails}>
              ... e mais {usuarios.length - 3} pessoas
            </Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF5ED',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  emailPreview: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  emailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  emailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  moreEmails: {
    fontStyle: 'italic',
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
});

export default EmailComposerScreen;