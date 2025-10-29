import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AnamneseProfessor from "./anamneseProfessor";
import Turmas from "./turmas";
 export default function HomeAluno({navigation}) {
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Bem-vindo, Aluno</Text>
            <View style={styles.botoesContainer}>
            <TouchableOpacity
            style={styles.botao}
            onPress={() => navigation.navigate('AnamneseProfessor')}>
            <Text style={styles.texto}>Ficha de Anamnese</Text>
            <MaterialCommunityIcons name="hospital-box-outline" size={24} color="#3d2f49" />
            </TouchableOpacity>

            <TouchableOpacity
            style={styles.botaorosa}
            onPress={() => navigation.navigate('Turmas')}>
            <Text style={styles.textorosa}>Ver suas turmas</Text>
            <Ionicons name="people-sharp" size={24} color="#fff" />
            </TouchableOpacity>
            </View>
        </View>
    );
 }

 const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FCF9F7',
        paddingHorizontal: 24,
        paddingTop: 60,
    },
    titulo: {
        fontSize: 22,
        fontWeight: '600',
        color: '#3d2f49',
        marginBottom: 40,
        textAlign: 'center',
    },
    botao: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 16,
        gap: 12,
        borderWidth: 1,
        borderColor: '#e8e8e8',
        shadowColor: 'rgba(61, 47, 73, 0.1)',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    botoesContainer: {
        gap: 12,
    },
    botaorosa: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#dd6b70',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 16,
        gap: 12,
        borderWidth: 1,
        borderColor: '#e8e8e8',
        shadowColor: 'rgba(61, 47, 73, 0.1)',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    texto: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    textorosa: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '500',
        flex: 1,
    },
 })