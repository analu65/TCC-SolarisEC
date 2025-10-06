import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../controller/controller";
export default function Turmas() { //continuar cadastro de turmas com base no cardanamnese
    const [dadosTurmas, setDadosturmas] = useState([]);
    const [erroTurma, setErroturma] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                setErroturma(null);
                const querySnapshot = await getDocs(collection(db, 'classes')); //pega todos os itens com o collection
                
                const todasTurmas = []; //lista com as turmas
                querySnapshot.forEach((doc) => {
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

        loadData();

    }, []);

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

    const primeiraTurma = dadosTurmas[0];
 
    return(
        <View style = {styles.container}>
        <View style = {styles.card}>
            <View style = {styles.header}>
                <Text style = {styles.nome}>{primeiraTurma.nome}</Text>
            </View>
        <ScrollView style={styles.scrollContainer}>
            <View style={styles.secao}>
                <Text style={styles.secaoDentro}>Professor responsável: </Text> {/*terminar professor*/}
                <Text style={styles.secaoDentro}>Dia: {primeiraTurma.dias}</Text>
                <Text style={styles.secaoDentro}>Horário de Início: {primeiraTurma.startTime}</Text>
                <Text style={styles.secaoDentro}>Horário de término: {primeiraTurma.finishTime}</Text>
                <Text style={styles.secaoDentro}>Alunos</Text> {/*terminar alunos no outro banco*/}
            </View>
        </ScrollView>
        </View>
        </View>
    );
} 

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center'

    },
    card: {
        padding:15,
        margin: 10,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        width: '95%',
        maxHeight: 500,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {

    },
    nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3d2f49',
    },
})