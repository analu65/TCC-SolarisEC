import { View, Text, StyleSheet, ScrollView } from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'; //icone do anamnese
import CardProfessorAluno from "../components/CardAnamneseProfessor"; //importa o card pra usar dentro do return
import { auth } from "../controller/controller";
import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';

export default function AnamneseProfalunos() {
  const [user, setUser] = useState(null); //faz o mesmo que o outro
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);


  if (!user) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.erroTexto}>Usuário não logado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome5 name="notes-medical" size={22} color="#3d2f49" />
        <Text style={styles.titulo}>Ficha de Anamnese</Text>
      </View>
      
      <ScrollView 
        style={styles.conteudocard} 
        contentContainerStyle={styles.conteudocontainer}
      >
        <CardProfessorAluno />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF1ED',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 25,
    marginLeft: 40,
    backgroundColor: '#FAF1ED',
    borderBottomWidth: 1,
    borderBottomColor: '#FAF1ED',
  },
  titulo: {
    fontSize: 21,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#3d2f49',
  },
  conteudocard: {
    flex: 1,
  },
  conteudocontainer: {
    flexGrow: 1,
    padding: 16,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  erroTexto: {
    textAlign: 'center',
    color: '#e74c3c',
    fontSize: 16,
  },
});