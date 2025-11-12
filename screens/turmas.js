import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where, deleteDoc, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db, auth } from "../controller/controller"; //importa o auth para pegar o usuario logado
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';

export default function Turmas() {
    const [dadosTurmas, setDadosturmas] = useState([]);
    const [erroTurma, setErroturma] = useState('');
    const [professores, setProfessores] = useState({});
    const [searchWord, setSearchWord] = useState('');
    const [alunos, setAlunos] = useState([]);
    const [turmaExpandida, setTurmaExpandida] = useState(null);
    const [usuarioLogado, setUsuarioLogado] = useState(null); //estado para o usuario logado

    const carregarUsuarios = async () => {
        try {
            const alunosQuery = query(collection(db, "users"), where("tipo", "==", "aluno")); //users onde o tipo é aluno
            const alunosSnapshot = await getDocs(alunosQuery);
            const alunosList = alunosSnapshot.docs.map(doc => ({
                id: doc.id, //pega o id do documento e todas as informacoes
                ...doc.data()
            }));
            setAlunos(alunosList);
        } catch (error) {
            console.error('Erro ao carregar usuários', error); //mensagem de erro
        }
    };

    useEffect(() => {
        const carregarUsuarioLogado = async () => {
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
                    }
                }
            } catch (error) {
                console.error('Erro ao carregar usuário logado:', error);
            }
        };

        const LoadData = async () => {
            try {
                setErroturma(null);
                
                await carregarUsuarioLogado(); //carrega os dados do usuario logado

                const professoresQuery = query(collection(db, "users"), where("tipo", "==", "professor")); //pega os professores
                const professoresSnapshot = await getDocs(professoresQuery);
                
                const professoresMap = {};
                professoresSnapshot.forEach((doc) => {
                    professoresMap[doc.id] = doc.data().nome; 
                });
                
                setProfessores(professoresMap);

                let turmasQuery;
                if (usuarioLogado && usuarioLogado.tipo === "professor") {
                    // se e professor, pega so as turmas dele
                    turmasQuery = query(
                        collection(db, 'classes'), 
                        where("professor", "==", usuarioLogado.id) //filtra pelo do professor logado
                    );
                } else {
                    //se nao e professor, pega todas as turmas
                    turmasQuery = collection(db, 'classes');
                }

                const turmasSnapshot = await getDocs(turmasQuery);
                const todasTurmas = []; //faz lista das turmas pra depois separar
                
                turmasSnapshot.forEach((doc) => {
                    todasTurmas.push({ //pega informacoes de cada uma
                        id: doc.id,
                        ...doc.data()
                    });
                });

                setDadosturmas(todasTurmas); //a lista de todas as turmas vira  o setdadosturmas

            } catch (error) {
                setErroturma("Erro ao carregar turmas");
                console.error("Erro:", error);
            }
        };

        LoadData();
        carregarUsuarios(); // Carrega a lista de alunos
    }, [usuarioLogado]); //recarrega quando o usuarioLogado mudar

    //adicionar aluno a turma
    const adicionarAlunoTurma = async (turmaId, alunoId) => {
        try {
            const turmaRef = doc(db, "classes", turmaId); //pega o documento classes do firebase
            
            await updateDoc(turmaRef, {
                alunos: arrayUnion(alunoId) //adiciona ao array de alunos da turma
            });

            setDadosturmas(prevTurmas => 
                prevTurmas.map(turma => 
                    turma.id === turmaId ? { ...turma, alunos: [...(turma.alunos || []), alunoId] } : turma
                )
            );

            Alert.alert("Sucesso", "Aluno adicionado à turma com sucesso!");
            
        } catch (error) {
            console.error("Erro ao adicionar aluno:", error);
            Alert.alert("Não foi possível adicionar o aluno à turma.");
        }
    };

    const removerAlunoTurma = async (turmaId, alunoId) => {
        try {
            const turmaRef = doc(db, "classes", turmaId);
            
            await updateDoc(turmaRef, {
                alunos: arrayRemove(alunoId) //remove do array de alunos da turma
            });

            setDadosturmas(prevTurmas => 
                prevTurmas.map(turma => 
                    turma.id === turmaId ? { ...turma, alunos: turma.alunos.filter(id => id !== alunoId)} : turma
                )
            );

            Alert.alert("Sucesso", "Aluno removido da turma com sucesso!");
            
        } catch (error) {
            console.error("Erro ao remover aluno:", error);
            Alert.alert("Erro", "Não foi possível remover o aluno da turma.");
        }
    };
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

    const alunoEstaNaTurma = (turma, alunoId) => {
        return turma.alunos && turma.alunos.includes(alunoId);
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
                                Professor: {turma.professor ? professores[turma.professor] || "Carregando..." : "Não definido"}
                            </Text>
                            <Text style={styles.secaoDentro}>Dia: {turma.dias}</Text>
                            <Text style={styles.secaoDentro}>Horário: {turma.startTime} - {turma.finishTime}</Text>
                            <Text style={styles.secaoDentro}>
                                Alunos: {turma.alunos && turma.alunos.length > 0 ? turma.alunos.length + " aluno(s)" : "Nenhum aluno"}
                            </Text>
                            <TouchableOpacity style={styles.botaoadicionar}
                            onPress={() => setTurmaExpandida(turmaExpandida === turma.id ? null : turma.id)}>
                                <Feather name="user-plus" size={20} color="black" />
                                <Text style={styles.nomeadicionar}>
                                    {turmaExpandida === turma.id ? "Fechar lista" : "Adicionar aluno"}
                                </Text>
                            </TouchableOpacity>
                            {turmaExpandida === turma.id && (
                                <>
                                <ScrollView style={styles.alunosContainer}>
                                    {alunos.map(aluno => ( //cria o scrollview e dentro coloca os alunos
                                        <TouchableOpacity 
                                        key={aluno.id} // pega id do aluno na key
                                        style={[
                                            styles.alunoItem, //estilo normal para o item
                                            alunoEstaNaTurma(turma, aluno.id) && styles.alunoNaTurma //estilo do aluno que esta na turma
                                        ]} 
                                        onPress={() => {
                                            if (alunoEstaNaTurma(turma, aluno.id)) {
                                                removerAlunoTurma(turma.id, aluno.id); //se o aluno ja esta na turma quer dizer que quando apertar ele sera removido com a funcao de remover, pega o id da turma e id do aluno
                                            } else {
                                                adicionarAlunoTurma(turma.id, aluno.id); //se nao esta na turma, vai adicionar o aluno na turma
                                            }
                                        }}
                                        >
                                        <Text style={styles.alunoNome}>{aluno.nome}</Text>
                                        </TouchableOpacity>
                                    ))}
                                                </ScrollView>
                                    </>
                            )}
                            
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
    },
    botaoadicionar: {
        flexDirection: 'row',
        padding: 10

    },
    nomeadicionar: {
        fontSize: 16,
        color: '#3d2f49',
        marginLeft: 7,
        marginTop: 5,
        fontWeight: '600'
    },
        alunosContainer: { //container do scrollview do aluno
        width: '90%',
        maxWidth: 400,
        maxHeight: 200,
        borderColor: '#3d2f49',
        borderRadius: 10,
        backgroundColor: '#fff',
        marginTop: 10,
        borderWidth: 2
    },
    alunoItem: { //item normal do aluno
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    alunoNaTurma: { //item do aluno que já está na turma
        backgroundColor: '#e6f7ff',
        borderLeftWidth: 3,
        borderLeftColor: '#3d2f49',
        
    },
    alunoNome: {
        fontSize: 16,
        fontWeight: '600',
        color: '#3d2f49',
    },
});