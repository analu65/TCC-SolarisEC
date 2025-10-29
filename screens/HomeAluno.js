import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
 export default function HomeAluno({navigation}) {
    return (
        <View style={styles.container}>
            <TouchableOpacity
            style={styles.botao}
            onPress={() = }>
            <Text style={styles.texto}>Ficha de Anamnese</Text>
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