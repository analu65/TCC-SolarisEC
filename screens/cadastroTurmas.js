import { StyleSheet, View, Text, TouchableOpacity, Button, TextInput, Platform } from "react-native";
import { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { db, auth } from "../controller/controller";
import { collection, addDoc, setDoc, doc, getDocs } from "firebase/firestore";


export default function cadastroTurmas({navigation}) {
    const [nome, setNome] = useState('');
    const [vagas, setVagas] = useState('');
    const [dias, setDias] = useState('');
    const[alunosInput, setalunosInput] = useState('');
    const [finishTime, setFinishTime] = useState('');
    const [startTime, setStartTime] = useState('');
    const [professor, setProfessor] = useState(''); //ver depois se é assim mesmo que coloca o professor
    const [alunos, setAlunos] = useState([]);
    const [alunosSelecionados, setAlunosSelecionados] = useState([]);

    useEffect(() => {
        carregarUsuarios();
    }, []);

    const carregarUsuarios = async () => {
        try{ //lembrar de pesquisar pra comentar aqui o que cada um significa
            const professoresQuery = query(collection(db, "classes"), where("tipo", "==", "professor"));
            const professoresSnapshot = await getDocs(professoresQuery);
            const professoresList = professoresSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProfessor(professoresList);

            const alunosQuery = query(collection(db, "classes"), where("tipo", "==", "aluno"));
            const alunosSnapshot = await getDocs(alunosQuery);
            const alunosList = alunosSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAlunos(alunosList);
        } catch (error){
            console.error('Erro ao carregar usuários', error)
        }
        };
        const cadastrar = async () => {
            if (!nome || !professor || !diasInput || !finishTime || !startTime) {
                alert("Por favor, preencha todos os campos obrigatórios!");
                return;
            }
            
            try {
                let alunosArray = [];
            if (alunosSelecionados.length > 0) {
                alunosArray = alunosSelecionados;
            } else if (alunosInput) {
                alunosArray = alunosInput 
                    .split(',')
                    .map(item => item.trim())
                    .filter(item => item !== '');
            }


                const userDocR = doc(db, "classes");

                await setDoc(userDocR, {
                    nome: nome || '',
                    vagas: vagas || '',
                    dias: dias || '',
                    alunos: alunosArray || '',
                    finishTime: finishTime || '',
                    startTime: startTime || '',
                    professor: professor || '',
                    alunos: alunos || ''

                });

            alert ('Cadastro realizado com sucesso');
            navigation.navigate('turmas');
    } catch (error) {
        alert("Erro ao cadastrar: " + error.message);
    }
};
    const renderConteudo = () => {
        <View style = {styles.content}>
            <View style = {styles.titulo}>Cadastro turma</View>
            <View style = {styles.subtitulo}>Preencha os dados abaixo para criar uma nova turma</View>
            <TextInput style={styles.input} placeholder="Digite o nome da turma (Ex: Lira, Tecido, Yoga...)" value={nome} onChangeText={setNome} autoCapitalize="none"/>
            <TextInput style={styles.input} placeholder="Digite o dia da turma" value={dias} onChangeText={setDias} autoCapitalize="none"/>

            


        </View>
    }


const styles = StyleSheet.create({
    content: {
            alignItems: 'center',
            paddingVertical: 30,
            paddingHorizontal: 20,
            backgroundColor: '#eee0d3',
            minHeight: Platform.OS === 'web' ? '100vh' : undefined,
        },
    titulo: { 
        fontSize: Platform.OS === 'web' ? 28 : 22,
        fontWeight: '800', 
        color: '#3d2f49', 
        textAlign: 'center',
        marginBottom: 10 
        },
    subtitulo: { 
        fontSize: 13, 
        fontWeight: '800', 
        color: '#3d2f49', 
        textAlign: 'center', 
        marginTop: 6,
        marginBottom: 20
        },
        input: { 
            width: '90%',
            maxWidth: 400,
            height: 45, 
            borderColor: '#ccc', 
            borderWidth: 1, 
            borderRadius: 12, 
            backgroundColor: '#fff', 
            marginTop: 15, 
            paddingHorizontal: 10, 
            fontSize: 16, 
            color: '#616161',
        },


})


