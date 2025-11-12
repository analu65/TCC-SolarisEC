import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from "../controller/controller";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function Avisos() {
    const [dadosAvisos, setDadosAvisos] = useState([]);
    const [erroAviso, setErroAviso] = useState('');

    useEffect(() => {
        const LoadData = async () => {
            try {
                setErroAviso(null);
                
                const avisosQuery = query(collection(db, 'sent_emails'), orderBy('dataEnvio', 'desc'));
                const avisosSnapshot = await getDocs(avisosQuery);
                
                const todosAvisos = [];
                avisosSnapshot.forEach((doc) => {
                    todosAvisos.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });

                setDadosAvisos(todosAvisos);

            } catch (error) {
                setErroAviso("Erro ao carregar avisos");
                console.error("Erro:", error);
            }
        };

        LoadData();
    }, []);

    const deletarAviso = async (avisoId, avisoAssunto) => {
        Alert.alert(
            "Confirmar exclusão",
            `Tem certeza que deseja excluir o aviso "${avisoAssunto}"?`,
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
                            await deleteDoc(doc(db, "sent_emails", avisoId));
                            setDadosAvisos(dadosAvisos.filter(aviso => aviso.id !== avisoId));
                            Alert.alert("Sucesso", "Aviso excluído com sucesso!");
                        } catch (error) {
                            console.error("Erro ao deletar aviso:", error);
                            Alert.alert("Erro", "Não foi possível excluir o aviso.");
                        }
                    }
                }
            ]
        );
    };

    const formatarData = (timestamp) => { //formata a data
        try {
            const date = timestamp.toDate();
            return date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Data inválida';
        }
    };

    if (erroAviso) {
        return (
            <View style={[styles.card, styles.centerContent]}>
                <Text style={styles.erroTexto}>{erroAviso}</Text>
            </View>
        );
    }

    if (dadosAvisos.length === 0) {
        return (
            <View style={[styles.card, styles.centerContent]}>
                <Text style={styles.erroTexto}>Nenhum aviso encontrado</Text>
            </View>
        );
    }

    return(
        <View style={styles.container}>
        <View style={styles.headertitulo}>
        <MaterialCommunityIcons name="bell" size={20} color="#3d2f49" />
        <Text style={styles.titulo}>Avisos</Text>
        </View>
          <ScrollView style={styles.scrollContainer}>
            {dadosAvisos.map((aviso) => (
              <View key={aviso.id} style={styles.card}>
                <View style={styles.informacoes}>
                    <View style={styles.header}>
                      <Text style={styles.assunto}>{aviso.subject || 'Sem assunto'}</Text>
                        <Text style={styles.data}>
                        {formatarData(aviso.dataEnvio)}
                        </Text>
                    </View>
                    <View style={styles.mensagemContainer}>
                      <Text style={styles.mensagem}>{aviso.body}</Text>
                    </View>
                    </View>
                        
                    <TouchableOpacity style={styles.icone} onPress={() => deletarAviso(aviso.id, aviso.subject)} activeOpacity={0.7}>
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
        backgroundColor: '#FCF9F7',
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
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#dd6a71'
    },
    informacoes: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
        flexWrap: 'wrap',
    },
    assunto: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3d2f49',
        flex: 1,
        marginRight: 10,
    },
    data: {
        fontSize: 12,
        color: '#666',
    },
    destinatario: {
        fontSize: 14,
        color: '#666',
        flex: 1,
    },
    mensagemContainer: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    mensagem: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    icone: {
        marginLeft: 10,
        padding: 8,
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
        color: '#e74c3c',
        textAlign: 'center',
    },
    headertitulo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 25,
    marginLeft: 18,
    marginBottom: 10
  },
    titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#3d2f49',
  },
});