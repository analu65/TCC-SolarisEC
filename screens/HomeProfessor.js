import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import AnamneseProfalunos from "./anamneseProfAlunos";
import AnamneseProfessor from "./anamneseProfessor";
import CadastroTurmas from "./cadastroTurmas";
import Turmas from "./turmas";
 export default function HomeProfessor() {
    return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.botao} //talvez nao esteja no stack
                    onPress={() => navigation.navigate('AnamneseProfalunos')}>
                    <Text style={styles.texto}>Ficha de Anamnese Alunos</Text>
                    <MaterialCommunityIcons name="hospital-box-outline" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.botao}//talvez nao esteja no stack
                    onPress={() => navigation.navigate('AnamneseProfessor')}>
                    <Text style={styles.texto}>Ficha de Anamnese Professor</Text>
                    <MaterialCommunityIcons name="hospital-box-outline" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.botao}
                    onPress={() => navigation.navigate('Turmas')}>
                    <Text style={styles.texto}>Ver suas turmas</Text>
                    <Ionicons name="people-sharp" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.botao} //talvez nao esteja no stack
                    onPress={() => navigation.navigate('CadastroTurmas')}>
                    <Text style={styles.texto}>Cadastrar Turma</Text>
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