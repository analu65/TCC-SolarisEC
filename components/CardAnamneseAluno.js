import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from "../controller/controller";

export default function CardAnamnese({ userId }) {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(null);
  
  useEffect(() => {
    const carregarDados = async () => { //o mesmo codigo do aluno vai ser utilizado no professor
      try {
        setErro(null);
        
        const userDocRef = doc(db, 'users', userId); //vai no db e pega os usuarios
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
  }
  
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.nome}>{dados.nome || 'Usuário'}</Text>
        <Text style={styles.tipoSanguineo}>{dados.tiposanguineo || ''}</Text>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>
          <Text style={styles.sectionContent}>Data de Nascimento: {dados.birthdate || "Não informado"}</Text>
          <Text style={styles.sectionContent}>CPF: {dados.cpf || "Não informado"}</Text>
          <Text style={styles.sectionContent}>Telefone: {dados.telefone || "Não informado"}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Endereço</Text>
          <Text style={styles.sectionContent}>{dados.rua || "Não informado"}, {dados.numero || ""}</Text>
          <Text style={styles.sectionContent}>Bairro: {dados.bairro || "Não informado"}</Text>
          <Text style={styles.sectionContent}>Cidade: {dados.cidade || "Não informado"}</Text>
          <Text style={styles.sectionContent}>CEP: {dados.cep || "Não informado"}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Problemas de Saúde</Text>
          <Text style={styles.sectionContent}>{dados.probsaude || "Nenhum informado"}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medicamentos em Uso</Text>
          <Text style={styles.sectionContent}>
            {dados.medicamentos && dados.medicamentos.length > 0 
              ? dados.medicamentos.join(', ') 
              : "Nenhum informado"}
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alergias</Text>
          <Text style={styles.sectionContent}>
            {dados.alergias && dados.alergias.length > 0 
              ? dados.alergias.join(', ') 
              : "Nenhuma informada"}
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Problemas Posturais</Text>
          <Text style={styles.sectionContent}>
            {dados.probposturais ? "Sim" : "Não"}
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Risco Cardíaco</Text>
          <Text style={styles.sectionContent}>
            {dados.riscocardiaco ? "Sim" : "Não"}
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dores Frequentes</Text>
          <Text style={styles.sectionContent}>
            {dados.doresfrequentes ? "Sim" : "Não"}
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contato de Emergência</Text>
          <Text style={styles.sectionContent}>Telefone: {dados.contato || "Não informado"}</Text>
          <Text style={styles.sectionSubContent}>Falar com: {dados.falarcom || "Não especificado"}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Atividade Física</Text>
          <Text style={styles.sectionContent}>
            {dados.pratica ? 'Pratica atividade física' : 'Não pratica atividade física'}
          </Text>
          {dados.pratica && (
            <>
              <Text style={styles.sectionSubContent}>Tipo: {dados.tipoAtiv || "Não especificado"}</Text>
              <Text style={styles.sectionSubContent}>Frequência: {dados.frequencia || "Não especificada"}</Text>
              <Text style={styles.sectionSubContent}>Tempo: {dados.tempo || "Não especificado"}</Text>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20, 
    margin: 10,
    backgroundColor: '#FAF1ED',
    borderRadius: 12, 
    width: '95%',
    minHeight: 600, 
    maxHeight: 700, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20, 
    paddingBottom: 15, 
    width: '100%', 
  },
  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3d2f49',
  },
  tipoSanguineo: {
    fontSize: 16, 
    color: '#e74c3c',
    fontWeight: '600',
  },
  scrollContainer: {
    maxHeight: 500,
    marginBottom: 15,
    width: '100%', 
  },
  section: {
    marginBottom: 20, 
    backgroundColor: '#fff',
    padding: 15, 
    borderRadius: 8,
    width: '100%', 
  },
  sectionTitle: {
    fontSize: 18, 
    fontWeight: '600',
    color: '#dd6b70',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 16, 
    color: '#34495e',
    lineHeight: 24, 
  },
  sectionSubContent: {
    fontSize: 14, 
    color: '#7f8c8d',
    marginTop: 5, 
    fontStyle: 'italic',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30, 
  },
  carregandoTexto: {
    marginTop: 15,
    color: '#7f8c8d',
    fontSize: 16, 
  },
  erroTexto: {
    color: '#e74c3c',
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16, 
  },
});