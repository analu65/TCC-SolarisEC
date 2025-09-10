import { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Image } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db, storage } from "../controller/controller";
import { Ionicons } from '@expo/vector-icons'; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';

const EmailComposerScreen = () => {
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [totalEmails, setTotalEmails] = useState(0);
  const [imagem, setImagem] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    buscarEmailsDoFirebase();
  }, []);

  const buscarEmailsDoFirebase = async () => {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      const emailsList = [];

      snapshot.forEach(doc => {
        const userData = doc.data();
        if (userData.email) {
          emailsList.push({
            email: userData.email,
            name: userData.name || userData.nome || 'Usuário',
            id: doc.id
          });
        }
      });
      setUsuarios(emailsList);
      setTotalEmails(emailsList.length);
    } catch (error) {
      console.error('Erro ao buscar emails', error);
      Alert.alert('Erro', 'Não foi possível carregar os emails dos usuários');
    }
  };

  const selecionarImagem = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria.');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImagem(result.assets[0]);
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem');
    }
  };

  const fazerUploadImagem = async () => {
    if (!imagem) return null;
    setUploading(true);

    try {
      const response = await fetch(imagem.uri);
      const blob = await response.blob();
      const nomeArquivo = `emails/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
      const storageRef = ref(storage, nomeArquivo);

      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Erro no upload:', error);
      Alert.alert('Erro', 'Falha ao fazer upload da imagem');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const enviarEmails = async () => {
    if (!assunto.trim() || !mensagem.trim()) {
        Alert.alert('Atenção', 'Preencha o assunto e a mensagem');
        return;
    }
    
    if (usuarios.length === 0) {
        Alert.alert('Atenção', 'Nenhum email encontrado no banco de dados');
        return;
    }
    
    Alert.alert('Confirmar envio', `Enviar email para ${totalEmails} pessoas?`, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Enviar', onPress: confirmarEnvio }
    ]);
}; 
  const confirmarEnvio = async () => {
    setEnviando(true);
    try {
      // Primeiro faz upload da imagem se existir
      let urlImagem = null;
      if (imagem) {
        urlImagem = await fazerUploadImagem();
      }

      const response = await fetch('https://us-central1-tcc--solaris.cloudfunctions.net/sendBulkEmails', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        }, 
        body: JSON.stringify({
          assunto: assunto,
          mensagem: mensagem,
          imagemUrl: urlImagem,
          emails: usuarios.map(u => ({ email: u.email, name: u.name }))
        })
      });
      
      const result = await response.json();
      if (result.sucessos) {
        Alert.alert('Sucesso!', `Emails enviados para ${result.sucessos} pessoas`,
          [{ text: 'OK', onPress: limparFormulario }]
        );
      } else {
        throw new Error(result.error || 'Erro desconhecido');
      } 
    } catch (error) {
      console.error('Erro no envio', error);
      Alert.alert('Erro', 'Não foi possível enviar os emails. Tente novamente');
    } finally {
      setEnviando(false);
    }
  };

  const limparFormulario = () => {
    setAssunto('');
    setMensagem('');
    setImagem(null);
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
        
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={20} color="#666" />
            <Text style={styles.infoText}>
              {totalEmails} destinatários encontrados
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={buscarEmailsDoFirebase} //botao de refresh busca com a funcao buscaremailsdofirebase
          >
            <Ionicons name="refresh-outline" size={18} color="#dd6b70" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Assunto</Text>
          <TextInput
            style={styles.input} //input do assunto
            value={assunto}
            onChangeText={setAssunto}
            placeholder="Digite o assunto do email..."
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mensagem</Text>
          <TextInput //campo da mensagem
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
        <View style={styles.inputContainer}>
      <Text style={styles.label}>Imagem (opcional)</Text>
      
      {imagem ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imagem.uri }} style={styles.imagePreview} />
          <TouchableOpacity 
            style={styles.removeImageButton}
            onPress={() => setImagem(null)}
          >
            <Ionicons name="close-circle" size={24} color="#dd6b70" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.imagePickerButton}
          onPress={selecionarImagem}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#dd6b70" />
          ) : (
            <>
              <Ionicons name="image-outline" size={24} color="#dd6b70" />
              <Text style={styles.imagePickerText}>Selecionar Imagem</Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
        
        <View style={styles.buttonContainer}>

          <TouchableOpacity 
            style={[styles.sendButton, enviando && styles.sendButtonDisabled]}
            onPress={enviarEmails}
            disabled={enviando}
          >
            {enviando ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Ionicons name="send-outline" size={18} color="white" />
                <Text style={styles.sendButtonText}>Enviar</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  previewButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  previewButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  sendButton: {
    backgroundColor: '#dd6b70',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
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