import { StyleSheet, View, Text, TouchableOpacity, Button, TextInput, Platform } from "react-native";
import { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { db, auth } from "../controller/controller";
import { collection, addDoc, setDoc, doc, getDocs } from "firebase/firestore";


export default function cadastroTurmas({navigation}) {
    const [nome, setNome] = useState('');
    const [vagas, setVagas] = useState('');
    const [diasInput, setDiasInput] = useState('');
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
                const diasArray = diasInput 
                    .split(',')
                    .map(item => item.trim())
                    .filter(item => item !== '');
    
    }


