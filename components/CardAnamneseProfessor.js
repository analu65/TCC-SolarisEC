import { View, Text, ScrollView, StyleSheet, TextInput, StatusBar } from "react-native";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../controller/controller";

export default function CardProfessorAluno() {
    const [dadosAlunos, setDadosAlunos] = useState([]); //dados dos alunos pra mexer depois
    const [erro, setErro] = useState(null);
    const [searchWord, setSearchWord] = useState('');

    useEffect(() => {
        const loadData = async () => { //carregar os dados
            try {
                setErro(null);
                const querySnapshot = await getDocs(collection(db, 'users')); //pega a colecao dos usuarios no banco users
                
                const todosAlunos = []; //lista com todos os alunos
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    todosAlunos.push({
                        id: doc.id,
                        ...data,
                        //arruma a data q nao ta mostrando depois
                        birthdate: formatarData(data.birthdate) //birthdate pega a funcao pra formatar a data
                    });
                });

                setDadosAlunos(todosAlunos);

            } catch (error) {
                setErro("Erro ao carregar alunos");
                console.error("Erro:", error);
            }
        };

        loadData();
    }, []); //parametro que a mari ensinou na sala pra botar no useeffect pra quando quiser executar so uma vez
    //se tivesse algo dentro como userid, essa funcao so seria feita se o userid udasse

    const formatarData = (timestamp) => { //formata a data de nascimento
        if (!timestamp) return "Não informado"; //se nao tiver timestamp  :) retorna nao informado
        
        try {
            //formatacao do timestamp que tava dando errado e eu nao sabia como rodar sem isso
            if (timestamp.seconds && timestamp.nanoseconds) {
                const date = new Date(timestamp.seconds * 1000); //armazena em javascript em milissegundos ao inves de segundos do firebase (pesquisar maia depois)
                return date.toLocaleDateString('pt-BR'); //retorna string pt br
            }
            
            //se ja for uma string
            if (typeof timestamp === 'string' || timestamp instanceof Date) {
                return new Date(timestamp).toLocaleDateString('pt-BR');
            }
            
            return "Data inválida";
        } catch (error) { //erro da em portugues se der errado
            console.error("Erro ao formatar data:", error);
            return "Data inválida"; //ver essa parte depois
        }
    };

    if (erro) { //se der erro aparece esse card, naosei se precisa dele
        return (
                <Text style={styles.erroTexto}>{erro}</Text>
        );
    }

    if (dadosAlunos.length === 0) { //se tiver 0 alunos
        return (
            <View style={[styles.card, styles.conteudomeio]}>
                <Text style={styles.erroTexto}>Nenhum aluno encontrado</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content"></StatusBar>
            <View style={styles.inputContainer}>
            <TextInput style={styles.input}
            placeholder="Pesquisar..."
            onChangeText={setSearchWord}></TextInput>
            </View>

                <ScrollView style={styles.scrollContainer}>
                {dadosAlunos.filter((aluno) => {
                    if (searchWord == ''){
                        return aluno
                    } else if (aluno.nome.toLowerCase().includes(searchWord.toLowerCase())){
                        return aluno
                    }
                }).map((aluno) => ( //mapeia os dados dos alunos do dadosalunos e transforma na funcao aluno que pega o id de cada um pra fazer varios cards diferentes
                    <View key={aluno.id} style={styles.card}>
                        <View style={styles.header}>
                            <Text style={styles.nome}>{aluno.nome || 'Usuário'}</Text>
                            <Text style={styles.tipoSanguineo}>{aluno.tiposanguineo || ''}</Text>
                        </View>
                        
                        <View style={styles.conteudo}>
                            <View style={styles.secao}>
                                <Text style={styles.secaoTitulo}>Informações Pessoais</Text>
                                <Text style={styles.secaoTexto}>Data de Nascimento: {aluno.birthdate}</Text>
                                <Text style={styles.secaoTexto}>CPF: {aluno.cpf || "Não informado"}</Text>
                                <Text style={styles.secaoTexto}>Telefone: {aluno.telefone || "Não informado"}</Text>
                                <Text style={styles.secaoTexto}>Email: {aluno.email || "Não informado"}</Text>
                            </View>
                            
                            <View style={styles.secao}>
                                <Text style={styles.secaoTitulo}>Endereço</Text>
                                <Text style={styles.secaoTexto}>{aluno.rua || "Não informado"}, {aluno.numero || ""}</Text>
                                <Text style={styles.secaoTexto}>Bairro: {aluno.bairro || "Não informado"}</Text>
                                <Text style={styles.secaoTexto}>Cidade: {aluno.cidade || "Não informado"}</Text>
                                <Text style={styles.secaoTexto}>CEP: {aluno.cep || "Não informado"}</Text>
                            </View>
                            
                            <View style={styles.secao}>
                                <Text style={styles.secaoTitulo}>Problemas de Saúde</Text>
                                <Text style={styles.secaoTexto}>{aluno.probsaude || "Nenhum informado"}</Text>
                            </View>
                            
                            <View style={styles.secao}>
                                <Text style={styles.secaoTitulo}>Medicamentos em Uso</Text>
                                <Text style={styles.secaoTexto}>
                                    {aluno.medicamentos && aluno.medicamentos.length > 0 
                                        ? aluno.medicamentos.join(', ') 
                                        : "Nenhum informado"}
                                </Text>
                            </View>
                            
                            <View style={styles.secao}>
                                <Text style={styles.secaoTitulo}>Alergias</Text>
                                <Text style={styles.secaoTexto}>
                                    {aluno.alergias && aluno.alergias.length > 0 
                                        ? aluno.alergias.join(', ') 
                                        : "Nenhuma informada"}
                                </Text>
                            </View>
                            
                            <View style={styles.secao}>
                                <Text style={styles.secaoTitulo}>Saúde</Text>
                                <Text style={styles.secaoTexto}>Problemas Posturais: {aluno.probposturais ? "Sim" : "Não"}</Text>
                                <Text style={styles.secaoTexto}>Risco Cardíaco: {aluno.riscocardiaco ? "Sim" : "Não"}</Text>
                                <Text style={styles.secaoTexto}>Dores Frequentes: {aluno.doresfrequentes ? "Sim" : "Não"}</Text>
                            </View>
                            
                            <View style={styles.secao}>
                                <Text style={styles.secaoTitulo}>Contato de Emergência</Text>
                                <Text style={styles.secaoTexto}>Telefone: {aluno.contato || "Não informado"}</Text>
                                <Text style={styles.secaoSubTexto}>Falar com: {aluno.falarcom || "Não especificado"}</Text>
                            </View>
                            
                            <View style={styles.secao}>
                                <Text style={styles.secaoTitulo}>Atividade Física</Text>
                                <Text style={styles.secaoTexto}>
                                    {aluno.pratica ? 'Pratica atividade física' : 'Não pratica atividade física'}
                                </Text>
                                {aluno.pratica && (
                                    <>
                                        <Text style={styles.secaoSubTexto}>Tipo: {aluno.tipoAtiv || "Não especificado"}</Text>
                                        <Text style={styles.secaoSubTexto}>Frequência: {aluno.frequencia || "Não especificada"}</Text>
                                        <Text style={styles.secaoSubTexto}>Tempo: {aluno.tempo || "Não especificado"}</Text>
                                    </>
                                )}
                            </View>
                        </View>
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
    },
    scrollContainer: {
        flex: 1,
    },
    card: {
        padding: 15,
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
    conteudo: {
        marginTop: 5,
    },
    secao: {
        marginBottom: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    secaoTitulo: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#3d2f49',
        marginBottom: 5,
    },
    secaoTexto: {
        fontSize: 14,
        marginBottom: 3,
        color: '#333',
    },
    secaoSubTexto: {
        fontSize: 13,
        color: '#666',
        marginLeft: 10,
        marginBottom: 2,
    },
    conteudomeio: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    erroTexto: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
    input: { 
        width: '90%',
        maxWidth: 400,
        height: 45, 
        borderColor: '#ccc', 
        borderWidth: 1, 
        borderRadius: 12, 
        backgroundColor: '#fff', 
        paddingHorizontal: 10, 
        fontSize: 16, 
        color: '#616161',
    },
    inputContainer: {
        alignItems: 'center', 
        marginBottom: 15,
    },
});