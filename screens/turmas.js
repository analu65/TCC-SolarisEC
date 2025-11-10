import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { db } from "../controller/controller";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function Turmas() {
    const [dadosTurmas, setDadosturmas] = useState([]);
    const [erroTurma, setErroturma] = useState('');
    const [professores, setProfessores] = useState({});
    const [searchWord, setSearchWord] = useState('');

    useEffect(() => {
        const LoadData = async () => {
            try {
                setErroturma(null);
                
                const professoresQuery = query(collection(db, "users"), where("tipo", "==", "professor"));
                const professoresSnapshot = await getDocs(professoresQuery);
                
                const professoresMap = {};
                professoresSnapshot.forEach((doc) => {
                    professoresMap[doc.id] = doc.data().nome; 
                });
                
                setProfessores(professoresMap);

                const turmasSnapshot = await getDocs(collection(db, 'classes'));
                const todasTurmas = [];
                
                turmasSnapshot.forEach((doc) => {
                    todasTurmas.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });

                setDadosturmas(todasTurmas);

            } catch (error) {
                setErroturma("Erro ao carregar turmas");
                console.error("Erro:", error);
            }
        };

        LoadData();
    }, []);

const deletarTurma = async (turmaId, turmaNome) => {
    Alert.alert(
        "Confirmar exclusão",
        `Tem certeza que deseja excluir a turma "${turmaNome}"?`,
        [
            {
                text: "Cancelar",
                style: "cancel"
            },
            {
                text: "Excluir",
                style: "destructive",
                onPress: async () => {
                    try {
                        await deleteDoc(doc(db, "classes", turmaId));
                        setDadosturmas(dadosTurmas.filter(turma => turma.id !== turmaId));
                    } catch (error) {
                        console.error("Erro ao deletar turma:", error);
                        Alert.alert("Erro", "Não foi possível excluir a turma.");
                    }
                }
            }
        ]
    );
};
    if (erroTurma) {
        return (
            <View style={[styles.card, styles.centerContent]}>
                <Text style={styles.erroTexto}>{erroTurma}</Text>
            </View>
        );
    }

    if (dadosTurmas.length === 0) {
        return (
            <View style={[styles.card, styles.centerContent]}>
                <Text style={styles.erroTexto}>Nenhuma turma cadastrada</Text>
            </View>
        );
    }

    return(
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer}>
                {dadosTurmas.map((turma) => (
                    <View key={turma.id} style={styles.card}>
                        <View style={styles.informacoes}>
                            <Text style={styles.nome}>{turma.nome}</Text>
                            <Text style={styles.secaoDentro}>
                                Professor: {turma.professor ? professores[turma.professor] || "Não encontrado" : "Não definido"}
                            </Text>
                            <Text style={styles.secaoDentro}>Dia: {turma.dias}</Text>
                            <Text style={styles.secaoDentro}>Horário: {turma.startTime} - {turma.finishTime}</Text>
                            <Text style={styles.secaoDentro}>
                                Alunos: {turma.alunos && turma.alunos.length > 0 ? turma.alunos.length + " aluno(s)" : "Nenhum aluno"}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.icone}
                            onPress={() => deletarTurma(turma.id, turma.nome)}
                            activeOpacity={0.7}
                        >
                            <MaterialCommunityIcons name="minus-circle-outline" size={24} color="#535353" />
                        </TouchableOpacity> 
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#FCF9F7"
    },
    scrollContainer: {
        flex: 1,
    },
    card: {
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        margin: 10,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        width: '95%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    informacoes: {
        flex: 1,
    },
    nome: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3d2f49',
        marginBottom: 8,
    },
    secaoDentro: {
        fontSize: 14,
        marginBottom: 4,
        color: '#333',
    },
    icone: {
        marginLeft: 10,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    erroTexto: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    }
});