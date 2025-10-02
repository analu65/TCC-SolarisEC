import { useState, useEffect } from "react";
import {View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Image } from "react-native";
import { collection, getDocs } from "firebase/firestore"; //dados para colocar no firebase
import { db } from "../controller/controller"; //banco de dados e talvez storage
import { Ionicons } from '@expo/vector-icons'; //icone
import * as ImagePicker from 'expo-image-picker'; //picker eh o componente de visual
import { getFunctions, httpsCallable } from "firebase/functions";

const EmailComposerScreen = () => { //dados para o firebase
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false); //enviando pra carregar
  const [usuarios, setUsuarios] = useState([]); //usuarios lista
  const [totalEmails, setTotalEmails] = useState(0); 
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    buscarEmailsDoFirebase();
  }, []);

  const buscarEmailsDoFirebase = async () => {
    try {
      const usersRef = collection(db, 'users'); //pega users do db users cadastrados
      const snapshot = await getDocs(usersRef); //pega documentos do users do usersref
      const emailsList = [];

      snapshot.forEach(doc => {
        const userData = doc.data(); //userdata pega a data dos documentos
        if (userData.email) { //se tiver emails no userdata
          emailsList.push({ //faz uma lista de emails, nomes e usuarios
            email: userData.email, //email do userdata
            name: userData.nome || 'Usuário', //nome do usuario
            id: doc.id
          });
        }
      });
      setUsuarios(emailsList); //usuarios sao a lista de emails
      setTotalEmails(emailsList.length); //totalemails eh o tamanho
      console.log(`${emailsList.length} usuários encontrados com email`); //numero de usuarios encontrados
    } catch (error) {
      console.error('Erro ao buscar emails', error);
      Alert.alert('Não foi possível carregar os emails dos usuários');
    }
  };

  const enviarEmails = async () => {
    console.log('iniciando envio'); //deixa ate ver se da certo
    console.log('Assunto:', assunto);
    console.log('Mensagem:', mensagem);
    console.log('Total usuários:', usuarios.length); //total de usuarios .. talvez nao precise
    
    if (!assunto.trim() || !mensagem.trim()) { //se o assunto ou a mensagem estiverem vazios
      console.log('assunto ou mensagem vazio');
      Alert.alert('Preencha o assunto e a mensagem');
      return;
    }
    
    if (usuarios.length === 0) {
      console.log('nenhum usuário encontrado');
      Alert.alert('Nenhum email encontrado no banco de dados'); //ate aqui esta funcionando, encontra os emails e entra no processo de envio
      return;
    }
    
    console.log('todas as validacoes passaram');
    console.log('Iniciando envio...'); //ate aqui vai
    await executarEnvioDeEmails(); //tenta executar o envio
  };

  const executarEnvioDeEmails = async () => {
    console.log('Executando envio de emails');
    setEnviando(true); //faz o setenviando ser true
      try{
      const payload = { //coloca os itens com os do firebase
        assunto: assunto,
        mensagem: mensagem,
        emails: usuarios.map(u => ({ email: u.email, name: u.name }))
      };

      console.log('preparado', payload);

      const functions = getFunctions();
      const sendBulkEmails = httpsCallable(functions, "sendBulkEmails"); //pega funcao
      const result = await sendBulkEmails(payload); //envia os emails

      console.log(' RESULTADO FINAL:', result.data);

      if (result.data?.sucessos !== undefined) {
        Alert.alert(
          ' Resultado do Envio', 
          ` Sucessos: ${result.data.sucessos}\n Erros: ${result.data.erros}`,
          [{ text: 'OK', onPress: limparFormulario }]
        );
      } else {
        throw new Error(result.data?.error || 'Formato de resposta inesperado');
      }

    }catch (error) {
      console.error('ERRO COMPLETO:', error);
      Alert.alert(
        'Erro no Envio', 
        `Falha ao enviar emails:\n\n${error.message}`
      );
    } finally {
      console.log('PROCESSO FINALIZADO');
      setEnviando(false);
    }
  };

  const limparFormulario = () => {
    console.log('🧹 Limpando formulário');
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
          <Text style={styles.headerTitle}>Enviar Email</Text>
        </View>

        {/* Assunto */}
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

        {/* Mensagem */}
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
          <Text style={styles.charCount}>{mensagem.length}/1000</Text> 
        </View>
        
        {/* Botão Enviar */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.sendButton, enviando && styles.sendButtonDisabled]}
            onPress={enviarEmails}
            disabled={enviando}
          >
            {enviando ? (
              <>
                <ActivityIndicator color="white" size="small" />
                <Text style={styles.sendButtonText}>Enviando...</Text>
              </>
            ) : (
              <Text style={styles.sendButtonText}>Enviar</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* preview de destinatários */}
        <View style={styles.emailPreview}>
          <Text style={styles.previewTitle}>Lista de destinatários:</Text>
          {usuarios.slice(0, 3).map((user, index) => (
            <View key={index} style={styles.emailItem}>
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
  )};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7EBE6',
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
  headerTitle: {
    fontSize: 24,
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
    fontSize: 16,
    color: '#666',
  },
  refreshButton: {
    padding: 8,
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
  charCount: {
    textAlign: 'right',
    color: '#999',
    fontSize: 12,
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  sendButton: {
    backgroundColor: '#dd6b70',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 150,
  },
  sendButtonDisabled: {
    backgroundColor: '#999',
  },
  sendButtonText: {
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
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
  },
  imagePickerText: {
    marginLeft: 10,
    color: '#dd6b70',
    fontWeight: '600',
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 15,
  },
});

export default EmailComposerScreen;