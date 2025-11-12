import { View, Text, StyleSheet, ScrollView } from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import CardAnamnese from "../components/CardAnamneseAluno";
import { auth } from "../controller/controller";
import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';

export default function AnamneseProfessor() {
  const [user, setUser] = useState(null);
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
      <View style={styles.centerContent}>
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
        <CardAnamnese 
          userId={user.uid} 
          style={styles.cardGrande}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF1ED',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    marginTop: 25,
    marginLeft: 60,
    backgroundColor: '#FAF1ED',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  titulo: {
    fontSize: 21,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#3d2f49',
  },
  conteudocard: {
    flex: 1,
    width: '100%',
  },
  conteudocontainer: {
    flexGrow: 1,
    padding: 16,
    alignItems: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  erroTexto: {
    textAlign: 'center',
    color: '#e74c3c',
    fontSize: 16,
  },
  cardGrande: {
    width: '100%',
    minHeight: 500,
    padding: 25,
    marginBottom: 20,
  },
});