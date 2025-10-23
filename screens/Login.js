import { StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../controller/controller";
import { useState } from "react";
import { getDoc, doc, collection, query, where, getDocs } from "firebase/firestore";

export default function Login({navigation}){
    const[email,setEmail]=useState(''); //consts do codigo da mariane
    const[senha,setSenha]=useState('');
    
    const VerificaUser=async()=>{
        try{
            const userCredential=await signInWithEmailAndPassword(auth,email,senha);
            const uid=userCredential.user.uid; //pega o uid
            const userDoc=await getDoc(doc(db,"users",uid)); //pega o users
            
            if(userDoc.exists()){
                const tipoUsuario=userDoc.data().tipo;
                if(tipoUsuario==="professor")navigation.navigate('HomeProfessor');
                else if(tipoUsuario==="aluno")navigation.navigate('HomeAluno');
                else alert('Tipo não reconhecido');
            }else{
                const emailQuery=await getDocs(query(collection(db,"users"),where("email","==",email)));
                if(!emailQuery.empty){
                    const tipoUsuario=emailQuery.docs[0].data().tipo;
                    if(tipoUsuario==="professor")navigation.navigate('HomeProfessor');
                    else if(tipoUsuario==="aluno")navigation.navigate('HomeAluno');
                    else alert('Tipo não reconhecido');
                    alert('Login sucesso.');
                }else{
                    alert('Dados não encontrados.');
                }
            }
        }catch(error){
            alert('Erro: '+error.message);
        }
    } 

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Faça Login</Text>
            <TextInput style={styles.input} placeholder="Digite seu email" keyboardType="email-address" value={email} onChangeText={setEmail} autoCapitalize="none"/>
            <TextInput style={styles.input} placeholder="Digite sua senha" secureTextEntry={true} value={senha} onChangeText={setSenha}/>
            <TouchableOpacity style={styles.botao} onPress={VerificaUser}>
                <Text style={styles.botaoTexto}>Entrar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#FAF1ED',
        justifyContent:'center',
        alignItems:'center'
    },
    title:{
        fontSize:22,
        fontWeight:'800',
        color:'#3d2f49',
        textAlign:'center',
        textShadowOffset:{width:2,height:2},
        textShadowRadius:4,
        marginBottom:30
    },
    input:{
        width:'75%',
        height:45,
        borderColor:'#ccc',
        borderWidth:1,
        borderRadius:12,
        backgroundColor:'#fff',
        marginTop:25,
        paddingHorizontal:10,
        fontSize:16,color:'#616161'
    },
    botao:{
        width:'75%',
        height:50,
        backgroundColor:'#3d2f49',
        borderRadius:12,
        marginTop:40,
        justifyContent:'center',
        alignItems:'center'
    },
    botaoTexto:{
        color:'#fff',
        fontSize:18,
        fontWeight:'bold',
        textAlign:'center'
    },
});