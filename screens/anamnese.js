import { View, Text, StyleSheet } from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import CardAnamnese from "../components/CardAnamneseAluno";
import { auth } from "../controller/controller"; // importe o auth
import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';

export default function AnamneseAluno() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
//coisas do context q vou deixar direto no codigo da anamnese pra ficar mais simples (context é do conteudo de autenticacao q a mari explicou)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) { //const pra mostrar carregando
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (!user) { //se o user nao estiver correto, mostra essa tela
    return (
      <View style={styles.container}>
        <Text style={styles.erroTexto}>Usuário não logado</Text>
      </View>
    );
  }

  return ( //aqui continua
    <View style={styles.container}>
      <FontAwesome5 name="notes-medical" size={24} color="#3d2f49" />
      <Text style={styles.titulo}>Ficha de Anamnese</Text>
      <CardAnamnese userId={user.uid} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FAF1ED',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 12,
    marginVertical: 16,
    color: '#3d2f49',
  },
  erroTexto: {
    textAlign: 'center',
    color: '#e74c3c',
    marginTop: 20,
    fontSize: 16,
  },
});