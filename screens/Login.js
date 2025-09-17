import { StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../controller/controller";
import { useState } from "react";
import HomeAluno from "./HomeAluno";
import HomeProfessor from "./HomeProfessor";
import { getDoc, doc, collection, query, where, getDocs } from "firebase/firestore";

export default function Login({navigation}){
    const[email,setEmail] = useState('');
    const[senha, setSenha] = useState('');
    const[loading, setLoading] = useState(false);
    
    const verificaUser = async () => {
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, senha);
            const uid = userCredential.user.uid;
            console.log('Usuário Logado. UID:', uid);
            
            // Método 1: Buscar pelo UID como documento
            const userDocRef = doc(db, "users", uid);
            const userDoc = await getDoc(userDocRef);
            
            console.log('Documento existe?', userDoc.exists());
            
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const tipoUsuario = userData.tipo;
                console.log('Dados do usuário:', userData);
                console.log('Tipo do usuário:', tipoUsuario);
                
                if (tipoUsuario === "professor") {
                    navigation.navigate('HomeProfessor');
                } else if (tipoUsuario === "aluno") {
                    navigation.navigate('HomeAluno');
                } else {
                    alert('Tipo de usuário não reconhecido');
                }
                
                alert('Login realizado com sucesso.');
            } else {
                console.log('Documento não encontrado. Tentando buscar por email...');
                
                // Método 2: Buscar pelo email (fallback)
                const usersRef = collection(db, "users");
                const emailQuery = query(usersRef, where("email", "==", email));
                const emailQuerySnapshot = await getDocs(emailQuery);
                
                if (!emailQuerySnapshot.empty) {
                    console.log('Usuário encontrado por email!');
                    const userData = emailQuerySnapshot.docs[0].data();
                    const tipoUsuario = userData.tipo;
                    
                    console.log('Dados do usuário (por email):', userData);
                    console.log('Tipo do usuário:', tipoUsuario);
                    
                    if (tipoUsuario === "professor") {
                        navigation.navigate('HomeProfessor');
                    } else if (tipoUsuario === "aluno") {
                        navigation.navigate('HomeAluno');
                    } else {
                        alert('Tipo de usuário não reconhecido');
                    }
                    
                    alert('Login realizado com sucesso.');
                } else {
                    console.log('Usuário não encontrado nem por UID nem por email');
                    
                    // Debug adicional
                    console.log('=== DEBUG INFO ===');
                    console.log('UID procurado:', uid);
                    console.log('Email procurado:', email);
                    
                    // Listar todos os documentos da coleção users (apenas para debug)
                    const allUsersSnapshot = await getDocs(collection(db, "users"));
                    console.log('Total de usuários na coleção:', allUsersSnapshot.size);
                    
                    allUsersSnapshot.forEach((doc) => {
                        console.log('Documento ID:', doc.id);
                        console.log('Dados:', doc.data());
                    });
                    
                    alert('Dados do usuário não encontrados. Verifique o console para mais detalhes.');
                }
            }
        } catch (error) {
            console.log('Erro ao realizar Login:', error.message);
            console.log('Código do erro:', error.code);
            alert('Erro ao realizar Login: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Faça Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite seu email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />
            <TextInput 
                style={styles.input}
                placeholder="Digite sua senha"
                secureTextEntry={true}
                value={senha}
                onChangeText={setSenha}
            />
            <TouchableOpacity 
                style={[styles.botao, loading && styles.botaoDisabled]} 
                onPress={verificaUser}
                disabled={loading}
            >
                <Text style={styles.botaoTexto}>
                    {loading ? 'Entrando...' : 'Entrar'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7EBE6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#3d2f49',
        textAlign: 'center',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
        marginBottom: 30,
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    botaoDisabled: {
        backgroundColor: '#8a7b94',
    },
    botaoTexto: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});