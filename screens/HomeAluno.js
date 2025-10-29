import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AnamneseProfessor from "./anamneseProfessor";
import Turmas from "./turmas";
 export default function HomeAluno({navigation}) {
    return (
        <View style={styles.container}>
            <TouchableOpacity
            style={styles.botao}
            onPress={() => navigation.navigate('AnamneseProfessor')}>
            <Text style={styles.texto}>Ficha de Anamnese</Text>
            <MaterialCommunityIcons name="hospital-box-outline" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
            style={styles.botao}
            onPress={() => navigation.navigate('Turmas')}>
            <Text style={styles.texto}>Ver suas turmas</Text>
            <Ionicons name="people-sharp" size={24} color="black" />
            </TouchableOpacity>
        </View>
    );
 }

 const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    botao: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 8,
        gap: 10, 
    },
    texto: {
        fontSize: 16,
        fontWeight: 'bold',
    }
 })