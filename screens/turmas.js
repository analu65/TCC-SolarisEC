import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../controller/controller"; //importa o auth para pegar o usuario logado
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function Turmas() {
    const [dadosTurmas, setDadosturmas] = useState([]);
    const [erroTurma, setErroturma] = useState('');
    const [professores, setProfessores] = useState({});
    const [usuarioLogado, setUsuarioLogado] = useState(null); //estado para o usuario logado

    useEffect(() => {
        const carregarTurmas = async () => {
            try {
                const user = auth.currentUser; //pega o usuario atual do auth
                if (user) {
                    //busca os dados do usuario no firestore
                    const userQuery = query(collection(db, "users"), where("__name__", "==", user.uid));
                    const userSnapshot = await getDocs(userQuery);
                    
                    if (!userSnapshot.empty) {
                        const userData = userSnapshot.docs[0].data();
                        setUsuarioLogado({
                            id: user.uid, //id do usuario
                            ...userData //dados do usuario
                        });
                        
                        let turmasQuery;
                        
                        if (userData.tipo === "professor") {
                            // Se é professor, pega as turmas onde ele é o professor
                            turmasQuery = query(
                                collection(db, 'classes'), 
                                where("professor", "==", user.uid) //filtra pelo id do professor logado
                            );
                        } else if (userData.tipo === "aluno") {
                            // Se é aluno, pega as turmas onde ele está na lista de alunos
                            turmasQuery = query(
                                collection(db, 'classes'), 
                                where("alunos", "array-contains", user.uid) //procura o id do aluno na array de alunos
                            );
                        } else {
                            // Se for outro tipo, pega todas as turmas
                            turmasQuery = collection(db, 'classes');
                        }

                        const turmasSnapshot = await getDocs(turmasQuery);
                        const turmasList = []; //faz lista das turmas
                        
                        turmasSnapshot.forEach((doc) => {
                            turmasList.push({ //pega informacoes de cada turma
                                id: doc.id,
                                ...doc.data()
                            });
                        });

                        setDadosturmas(turmasList); //atualiza a lista de turmas
                    }
                }
            } catch (error) {
                setErroturma("Erro ao carregar turmas");
                console.error("Erro:", error);
            }
        };

        carregarTurmas();
    }, []);

    //deletar a turma 
    const deletarTurma = async (turmaId, turmaNome) => {
        Alert.alert(
            "Confirmar exclusão",
            `Tem certeza que deseja excluir a turma "${turmaNome}"?`,
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                    //mensagem para confirmar a exclusao da turma
                },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, "classes", turmaId)); //deleta a turma do firestore
                            setDadosturmas(dadosTurmas.filter(turma => turma.id !== turmaId)); //remove a turma da lista local
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
                <Text style={styles.erroTexto}>Nenhuma turma encontrada</Text>
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
                            <Text style={styles.secaoDentro}>Dia: {turma.dias}</Text>
                            <Text style={styles.secaoDentro}>Horário: {turma.startTime} - {turma.finishTime}</Text>
                            <Text style={styles.secaoDentro}>
                                Alunos: {turma.alunos && turma.alunos.length > 0 ? turma.alunos.length + " aluno(s)" : "Nenhum aluno"}
                            </Text>
                        </View>
                        
                        {usuarioLogado && usuarioLogado.tipo === "professor" && (
                            <TouchableOpacity
                                style={styles.icone}
                                onPress={() => deletarTurma(turma.id, turma.nome)}
                                activeOpacity={0.7}
                            >
                                <MaterialCommunityIcons name="minus-circle-outline" size={24} color="#535353" />
                            </TouchableOpacity> 
                        )}
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
        flexDirection: 'row', //deixa em linha para o botão ficar ao lado
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
        flex: 1, //ocupa todo o espaço disponível
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
    },
});