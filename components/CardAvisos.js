import { View, Text, ScrollView, StyleSheet  } from "react-native";
import { useState, useEffect } from "react";
import { collection, getDocs, getDoc } from "firebase/firestore";
import { db } from "../controller/controller";

export default function CardAvisos({userId}){
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const carregarDados = async () => { //o mesmo codigo do aluno vai ser utilizado no professor
      try {
        setErro(null);
        
        const userDocRef = doc(db, 'sent_emails', userId); //vai no db e pega os usuarios
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data(); //userdata pega as informacoes do usuario
          console.log('Dados recebidos do Firebase:', userData);
          setDados(userData);
        } else {
          setErro("Usuário não encontrado");
        }
      } catch (error) {
        setErro("Erro ao carregar dados");
        console.error("Erro:", error);
      }
    };
    
    if (userId) {
      carregarDados();
    } else {
      setErro("ID do usuário não fornecido");
    }
  }, [userId]);
  
  if (erro) {
    return (
      <View style={[styles.card, styles.centerContent]}>
        <Text style={styles.erroTexto}>{erro}</Text>
      </View>
    );
  }
  
  if (!dados) {
    return (
      <View style={[styles.card, styles.centerContent]}>
        <Text style={styles.erroTexto}>Nenhum dado encontrado</Text>
      </View>
    );
  }}

const styles = StyleSheet.create({
    card: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        margin: 10,
        backgroundColor: '#FAF1ED',
        borderRadius: 8,
        width: '100%',
        maxHeight: 500,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
      },
      erroTexto: {
        color: '#e74c3c',
        marginBottom: 15,
        textAlign: 'center',
      },
      centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      },




  });