import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../controller/controller";
export default function Turmas() { //continuar cadastro de turmas com base no cardanamnese
    const [dadosTurmas, setDadosturmas] = useState([]); //lista do dados das turmas
    const [erroTurma, setErroturma] = useState(''); //const de erro

    useEffect(() => { //usei esse codigo que foi como a mari ensinou nas aulas para os outros inclusive o anamnese professor que consulta os alunos
        const loadData = async () => {
            try {
                setErroturma(null);
                const querySnapshot = await getDocs(collection(db, 'classes')); //pega todos os itens com o collection
                
                const todasTurmas = []; //lista com as turmas
                querySnapshot.forEach((doc) => { //para cada
                    todasTurmas.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });

                setDadosturmas(todasTurmas);

            } catch (error) { //mensagem de erro
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

 
    return(
        <View style = {styles.container}>
        <ScrollView style={styles.scrollContainer}>
        {dadosTurmas.map((turma) => ( //pega todas as turmas do banco ao inves de uma so, mapeando todas e transformando na funcao turma
            <View key={turma.id} style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.nome}>{turma.nome}</Text>
            </View>
            <View style={styles.secao}>
                <Text style={styles.secaoDentro}>Professor responsável: </Text> {/*terminar professor*/}
                <Text style={styles.secaoDentro}>Dia: {turma.dias}</Text>
                <Text style={styles.secaoDentro}>Horário de Início: {turma.startTime}</Text>
                <Text style={styles.secaoDentro}>Horário de término: {turma.finishTime}</Text>
                <Text style={styles.secaoDentro}>Alunos:</Text> {/*terminar alunos no outro banco*/}
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
        marginBottom: 10,
    },
    nome: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3d2f49',
    },
    secao: {
        marginTop: 5,
    },
    secaoDentro: {
        fontSize: 14,
        marginBottom: 5,
        color: '#333',
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