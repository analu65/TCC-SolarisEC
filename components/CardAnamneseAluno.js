import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from "../controller/controller";

export default function CardAnamnese({ userId }) {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(null);
  
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setErro(null);
        
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
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
        <Text style={styles.tipoSanguineo}>{dados.tiposanguineo || "Tipo Sanguíneo não informado"}</Text>
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
    padding: 15,
    margin: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    width: '100%',
    maxHeight: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 10,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3d2f49',
  },
  tipoSanguineo: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '600',
  },
  scrollContainer: {
    maxHeight: 380,
    marginBottom: 10,
  },
  section: {
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#dd6b70',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dd6b70',
    marginBottom: 5,
  },
  sectionContent: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 20,
  },
  sectionSubContent: {
    fontSize: 13,
    color: '#7f8c8d',
    marginTop: 3,
    fontStyle: 'italic',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  carregandoTexto: {
    marginTop: 10,
    color: '#7f8c8d',
  },
  erroTexto: {
    color: '#e74c3c',
    marginBottom: 15,
    textAlign: 'center',
  },
});