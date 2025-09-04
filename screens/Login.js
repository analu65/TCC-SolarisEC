import { StyleSheet, View, Text, TextInput , ImageBackground, TouchableOpacity } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../controller/controller";
import { useState } from "react";
export default function Login({navigation}){
    const[email,setEmail] = useState('');
    const[senha, setSenha] = useState('');


    const verificaUser = () => {
        signInWithEmailAndPassword(auth, email, senha)
        .then((usercredential) => {
            console.log('Usuário Logado.');
            alert('Login realizado com sucesso.')

            navigation.navigate('HomeTab')
        })
        .catch ((error) => {
            console.log('Erro ao realizar Login.', error.message);
            alert('Erro ao realizar Login.')
        })
    }
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Faça Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite seu email"
                keyboardType="default"
                value={email}
                onChangeText={setEmail} >
            </TextInput>
            <TextInput style={styles.input}
                placeholder="Digite sua senha"
                keyboardType="default"
                value={senha}
                onChangeText={setSenha} >
            </TextInput>
                <TouchableOpacity style={styles.botao} onPress={verificaUser}>
                <Text style={styles.botaoTexto}>Cadastrar</Text>
                </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee0d3',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#3d2f49',
        textAlign: 'center',
        textShadowColor: 'rgba(61, 47, 73, 0.3)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    input: {
        width: '75%',
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 12,
        backgroundColor: '#fff',
        marginTop: 25,
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#616161',
    },
    botao: {
        width: '75%',
        height: 50,
        backgroundColor: '#3d2f49',
        borderRadius: 12,
        marginTop: 40,
    },
    botaoTexto: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },


})