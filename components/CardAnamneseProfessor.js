import { View, Text, ScrollView, StyleSheet } from "react-native"; //pesquisa como que coloca do jeito do turmas pra terminar na proxima aula e comecar a barra de pesquisa e depois o email, deixa a estilizacao p depois do email, pesquisa como faz ele tb
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../controller/controller";

export default function CardProfessorAluno(){
    const [dadosAlunos, setDadosAlunos] = useState([]);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setErro(null);
                const querySnapshot = await getDocs(collection(db, 'users'));
                
                const todosAlunos = [];
                querySnapshot.forEach((doc) => {
                    todosAlunos.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });

                setDadosAlunos(todosAlunos);

            } catch (error) {
                setErro("Erro ao carregar alunos");
                console.error("Erro:", error);
            }
        };

        loadData();
    }, []);

    if (erro) {
        return (
            <View style={[styles.card, styles.centerContent]}>
                <Text style={styles.erroTexto}>{erro}</Text>
            </View>
        );
    }

    if (dadosAlunos.length === 0) {
        return (
            <View style={[styles.card, styles.centerContent]}>
                <Text style={styles.erroTexto}>Nenhum aluno encontrado</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {dadosAlunos.map((aluno) => (
                <View key={aluno.id} style={styles.card}>
                    <View style={styles.header}>
                        <Text style={styles.nome}>{aluno.nome || 'Usuário'}</Text>
                        <Text style={styles.tipoSanguineo}>{aluno.tiposanguineo || ''}</Text>
                    </View>
                    
                    <ScrollView style={styles.scrollContainer}>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Informações Pessoais</Text>
                            <Text style={styles.sectionContent}>Data de Nascimento: {aluno.birthdate || "Não informado"}</Text>
                            <Text style={styles.sectionContent}>CPF: {aluno.cpf || "Não informado"}</Text>
                            <Text style={styles.sectionContent}>Telefone: {aluno.telefone || "Não informado"}</Text>
                        </View>
                        
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Endereço</Text>
                            <Text style={styles.sectionContent}>{aluno.rua || "Não informado"}, {aluno.numero || ""}</Text>
                            <Text style={styles.sectionContent}>Bairro: {aluno.bairro || "Não informado"}</Text>
                            <Text style={styles.sectionContent}>Cidade: {aluno.cidade || "Não informado"}</Text>
                            <Text style={styles.sectionContent}>CEP: {aluno.cep || "Não informado"}</Text>
                        </View>
                        
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Problemas de Saúde</Text>
                            <Text style={styles.sectionContent}>{aluno.probsaude || "Nenhum informado"}</Text>
                        </View>
                        
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Medicamentos em Uso</Text>
                            <Text style={styles.sectionContent}>
                                {aluno.medicamentos && aluno.medicamentos.length > 0 
                                    ? aluno.medicamentos.join(', ') 
                                    : "Nenhum informado"}
                            </Text>
                        </View>
                        
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Alergias</Text>
                            <Text style={styles.sectionContent}>
                                {aluno.alergias && aluno.alergias.length > 0 
                                    ? aluno.alergias.join(', ') 
                                    : "Nenhuma informada"}
                            </Text>
                        </View>
                        
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Problemas Posturais</Text>
                            <Text style={styles.sectionContent}>
                                {aluno.probposturais ? "Sim" : "Não"}
                            </Text>
                        </View>
                        
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Risco Cardíaco</Text>
                            <Text style={styles.sectionContent}>
                                {aluno.riscocardiaco ? "Sim" : "Não"}
                            </Text>
                        </View>
                        
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Dores Frequentes</Text>
                            <Text style={styles.sectionContent}>
                                {aluno.doresfrequentes ? "Sim" : "Não"}
                            </Text>
                        </View>
                        
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Contato de Emergência</Text>
                            <Text style={styles.sectionContent}>Telefone: {aluno.contato || "Não informado"}</Text>
                            <Text style={styles.sectionSubContent}>Falar com: {aluno.falarcom || "Não especificado"}</Text>
                        </View>
                        
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Atividade Física</Text>
                            <Text style={styles.sectionContent}>
                                {aluno.pratica ? 'Pratica atividade física' : 'Não pratica atividade física'}
                            </Text>
                            {aluno.pratica && (
                                <>
                                    <Text style={styles.sectionSubContent}>Tipo: {aluno.tipoAtiv || "Não especificado"}</Text>
                                    <Text style={styles.sectionSubContent}>Frequência: {aluno.frequencia || "Não especificada"}</Text>
                                    <Text style={styles.sectionSubContent}>Tempo: {aluno.tempo || "Não especificado"}</Text>
                                </>
                            )}
                        </View>
                    </ScrollView>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    card: {
        padding: 15,
        margin: 10,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
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
        marginBottom: 10,
    },
    nome: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3d2f49',
    },
    tipoSanguineo: {
        fontSize: 16,
        color: '#666',
    },
    scrollContainer: {
        maxHeight: 400,
    },
    section: {
        marginBottom: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#3d2f49',
        marginBottom: 5,
    },
    sectionContent: {
        fontSize: 14,
        color: '#333',
        marginBottom: 3,
    },
    sectionSubContent: {
        fontSize: 13,
        color: '#666',
        marginLeft: 10,
        marginBottom: 2,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    erroTexto: {
        color: '#e74c3c',
        fontSize: 16,
        textAlign: 'center',
    },
});