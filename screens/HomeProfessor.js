import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function HomeProfessor({ navigation }) { //um rosa e um branco
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Bem-vindo, Professor</Text>
            

            <View style={styles.botoesContainer}>
                

                <TouchableOpacity
                    style={styles.botaorosa}
                    onPress={() => navigation.navigate('AnamneseProfalunos')}
                    activeOpacity={0.7}
                >
                    <MaterialCommunityIcons name="hospital-box" size={24} color="#fff" />
                    <Text style={styles.botaoTextorosa}>Ficha de Anamnese Alunos</Text>
                </TouchableOpacity>


                <TouchableOpacity
                    style={styles.botao}
                    onPress={() => navigation.navigate('AnamneseProfessor')}
                    activeOpacity={0.7}
                >
                    <MaterialCommunityIcons name="hospital-box-outline" size={22} color="#3d2f49" />
                    <Text style={styles.botaoTexto}>Ficha de Anamnese Professor</Text>
                </TouchableOpacity>


                <TouchableOpacity
                    style={styles.botaorosa}
                    onPress={() => navigation.navigate('Turmas')}
                    activeOpacity={0.7}
                >
                    <Ionicons name="people" size={24} color="#fff" />
                    <Text style={styles.botaoTextorosa}>Ver suas turmas</Text>
                </TouchableOpacity>


                <TouchableOpacity
                    style={styles.botao}
                    onPress={() => navigation.navigate('CadastroTurmas')}
                    activeOpacity={0.7}
                >
                    <Ionicons name="people-outline" size={24} color="#3d2f49" />
                    <Text style={styles.botaoTexto}>Cadastrar Turma</Text>
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
    botoesContainer: {
        gap: 12,
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
    botaoTexto: {
        color: '#3d2f49',
        fontSize: 15,
        fontWeight: '500',
        flex: 1,
    },
    botaoTextorosa: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '500',
        flex: 1,
    },
});