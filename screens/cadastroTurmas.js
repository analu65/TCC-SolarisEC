import { StyleSheet, View, Text, TouchableOpacity, TextInput, Platform } from "react-native";
import { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { db, auth } from "../controller/controller";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { ScrollView } from "react-native";

export default function CadastroTurmas({ navigation }) { //todos os itens para o cadastro (checar vagas depois para ver se consigo o que quero sozinha)
    const [nome, setNome] = useState('');
    const [vagas, setVagas] = useState('');
    const [dias, setDias] = useState('');
    const [alunosInput, setAlunosInput] = useState('');
    const [finishTime, setFinishTime] = useState('');
    const [startTime, setStartTime] = useState('');
    const [professor, setProfessor] = useState('');
    const [alunos, setAlunos] = useState([]);
    const [professoresList, setProfessoresList] = useState([]); //lista dos professores do picker
    const [alunosSelecionados, setAlunosSelecionados] = useState([]); //alunos selecionados do scrollview

    useEffect(() => {
        carregarUsuarios();
    }, []);

    const carregarUsuarios = async () => {
        try {
            const professoresQuery = query(collection(db, "users"), where("tipo", "==", "professor")); //users onde o tipo é professor
            const professoresSnapshot = await getDocs(professoresQuery); //pega os dados do banco de cima
            const professoresList = professoresSnapshot.docs.map(doc => ({ //snapshot é pra assegurar que nao vai ficar diferente depois
                id: doc.id,
                ...doc.data()
            }));
            setProfessoresList(professoresList); //lista de professores feita

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

    const toggleAlunoSelecionado = (alunoId) => { //adiciona ou remove aluno da lista de aluno selecionado
        setAlunosSelecionados(prev => { //prev usa a versao mais recente do estado anterior
            if (prev.includes(alunoId)) { //se ja estiver alunoid cadastrado
                return prev.filter(id => id !== alunoId); //retorna apenas os que sao diferentes do alunoid se ele nao estiver no alunosselecionados
            } else {
                return [...prev, alunoId]; //coloca ele na lista
            }
        });
    };  

    const cadastrar = async () => { //funcao de cadastrar e se nao tiver esses ele nao deixa cadastrar 
        if (!nome || !professor || !dias || !finishTime || !startTime) {
            alert("Por favor, preencha todos os campos obrigatórios!");
            return;
        }
            
        try {
            let alunosArray = []; //faz o array dos alunos para botar no firebase
            if (alunosSelecionados.length > 0) { //length é o tamanho do numero de alunosselecionados
                alunosArray = alunosSelecionados; //array e igual a alunosselecionados se tiver mais de um
            } else if (alunosInput) {
                alunosArray = alunosInput //coloca pro alunosinput
                    .split(',') //separa virgula
                    .map(item => item.trim())
                    .filter(item => item !== '');
            }

            const turmaData = {
                nome: nome,
                vagas: vagas || '',
                dias: dias,
                alunos: alunosArray,
                finishTime: finishTime,
                startTime: startTime,
                professor: professor, //const pra juntar os nomes do codigo com os nomes do firebase e assimilar pra cadastrar os dados
            };

            await addDoc(collection(db, "classes"), turmaData); //cadastra os dados no classes

            alert('Cadastro realizado com sucesso'); //mensagem de alerta e volta pra pagina anterior
            navigation.goBack();

        } catch (error) {
            alert("Erro ao cadastrar: " + error.message);//mensagem de erro
        }
    };

    const renderContent = () => { //conteudo do codigo pra depois passar pro return
        return (
            <View style={styles.content}>
            <Text style={styles.titulo}>Cadastro turma</Text>
            <Text style={styles.subtitulo}>Preencha os dados abaixo para criar uma nova turma</Text>
                
            <TextInput style={styles.input} placeholder="Digite o nome da turma (Ex: Lira, Tecido, Yoga...)" value={nome} onChangeText={setNome}
            />
                
            <Text style={styles.label}>Professor responsável:</Text>
                <View style={{
                width: '90%',
                maxWidth: 400,
                height: 45,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 12,
                overflow: 'hidden',
                justifyContent: 'center',
                backgroundColor: '#fff',
                marginTop: 10
                }}>
                <Picker
                selectedValue={professor}
                onValueChange={setProfessor}
                style={{
                    width: '100%',
                    color: '#616161',
                }}
                itemStyle={{ fontSize: 12 }} // diminui a fonte dos itens no iOS
                >
                <Picker.Item label="Selecione um professor" value="" />
                {professoresList.map(prof => (
                    <Picker.Item key={prof.id} label={prof.nome} value={prof.id} />
                ))}
                </Picker>



                </View>

                <TextInput 
                    style={styles.input} 
                    placeholder="Digite o dia da turma (ex: Segunda, Quarta, Sexta)" 
                    value={dias} 
                    onChangeText={setDias}
                />
                
                <View style={styles.timeContainer}>
                    <View style={styles.timeInputContainer}>
                        <Text style={styles.timeLabel}>Horário Início: </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 08:00"
                            value={startTime}
                            onChangeText={setStartTime}
                        />
                    </View>
                    
                    <View style={styles.timeInputContainer}> 
                        <Text style={styles.timeLabel}>Horário Fim:</Text>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Ex: 10:00" //placeholder coloca exemplo de hora
                            value={finishTime} 
                            onChangeText={setFinishTime}
                        />
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Alunos</Text>
                
                <Text style={styles.label}>Selecionar alunos:</Text>
                
                <ScrollView style={styles.alunosContainer}>
                    {alunos.map(aluno => ( //cria o scrollview e dentro coloca os alunos
                        <TouchableOpacity 
                            key={aluno.id} // pega id do aluno na key
                            style={[
                                styles.alunoItem, 
                                alunosSelecionados.includes(aluno.id) && styles.alunoSelecionado //aplica estilo diferente para aluno selecionado
                            ]} 
                            onPress={() => toggleAlunoSelecionado(aluno.id)} //quando clicar chama a funcao da selecao se baseando no id do aluno
                        >
                            <Text style={styles.alunoNome}>{aluno.nome}</Text>
                            <Text style={styles.alunoEmail}>{aluno.email}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <TouchableOpacity style={styles.botao} onPress={cadastrar}>
                    <Text style={styles.botaoTexto}>Cadastrar Turma</Text>
                </TouchableOpacity>
            </View>
        );
    };

    if (Platform.OS === 'web') {
        return (
            <View style={styles.webContainer}>
                <ScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
                    {renderContent()}
                </ScrollView>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {renderContent()}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FCF9F7',
    },
    webContainer: {
        height: '100vh',
        overflow: 'auto',
    },
    content: {
        alignItems: 'center',
        paddingVertical: 30,
        paddingHorizontal: 20,
        backgroundColor: '#FCF9F7',
    },
    titulo: { 
        fontSize: 22,
        fontWeight: '700', 
        color: '#3d2f49', 
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitulo: { 
        fontSize: 12, 
        fontWeight: '600', 
        color: '#3d2f49', 
        textAlign: 'center', 
        marginTop: 6,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#3d2f49',
        marginTop: 30,
        marginBottom: 10,
        alignSelf: 'center',
        width: '90%',
        maxWidth: 400,
    },
    label: { //nome professor
        fontSize: 14,
        fontWeight: '600',
        color: '#3d2f49',
        marginTop: 15,
        alignSelf: 'center',
        width: '90%',
        maxWidth: 400,
    },
    input: { //inputs
        width: '90%',
        maxWidth: 400,
        height: 45, 
        borderColor: '#ccc', 
        borderWidth: 1,
        borderRadius: 11, 
        backgroundColor: '#fff', 
        marginTop: 10, 
        paddingHorizontal: 10, 
        fontSize: 16, 
        color: '#616161',
    },
    timeContainer: {
        flexDirection: Platform.OS === 'web' ? 'row' : 'column',
        width: '90%',
        maxWidth: 400,
        justifyContent: 'space-between',
    },
    timeInputContainer: {
        flex: Platform.OS === 'web' ? 1 : 0,
        marginHorizontal: Platform.OS === 'web' ? 5 : 0,
        width: Platform.OS === 'web' ? '48%' : '100%',
    },
    timeLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#3d2f49',
        marginTop: 15,
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
        padding: 5
    },
    alunoSelecionado: { //item do aluno selecionado
        backgroundColor: '#e6f7ff',
        borderLeftWidth: 3,
        borderLeftColor: '#3d2f49',
        
    },
    alunoNome: {
        fontSize: 16,
        fontWeight: '600',
        color: '#3d2f49',
    },
    alunoEmail: {
        fontSize: 12,
        color: '#666',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    botao: { 
        width: '90%',
        maxWidth: 400,
        height: 50, 
        backgroundColor: '#3d2f49', 
        borderRadius: 12, 
        marginTop: 30, 
        marginBottom: 15,
        justifyContent: "center"
    },
    botaoTexto: { 
        color: '#fff', 
        fontSize: 18, 
        fontWeight: 'bold', 
        textAlign: 'center' 
    },
    botaoSecundarioTexto: { 
        color: '#3d2f49', 
        fontSize: 18, 
        fontWeight: 'bold', 
        textAlign: 'center' 
    },
});