import { View, StyleSheet, TouchableOpacity, Text, ScrollView, Switch, TextInput, Platform } from "react-native";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { db, auth } from "../controller/controller";
import { collection, addDoc, setDoc, doc, query, where, getDocs } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function SignUp({navigation}){
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [tipo, setTipo] = useState('aluno');
    const [cpf, setCpf] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const[cidade, setCidade] = useState('');
    const[cep, setCep] = useState('');
    const[bairro, setBairro] = useState('');
    const[rua,setRua] = useState('');
    const[numero,setNumero] = useState('');
    const[tiposanguineo, setTiposanguineo] = useState('');
    const[probsaude, setProbsaude] = useState('');
    const[alergiasinput, setAlergiasinput] = useState('');
    const[medicamentosinput, setMedicamentosinput] = useState('');
    const[probposturais, setProbposturais] = useState(false);
    const[riscocardiaco, setRiscocardiaco] = useState(false);
    const[doresfrequentes, setDoresfrequentes] = useState(false);
    const[contatoemergencia, setContatoemergencia] = useState('');
    const[falarcom, setFalarcom] = useState('');
    const[praticaativ, setPraticaativ] = useState(false);
    const[frequenciaativ, setFrequenciaativ] = useState('');
    const[tipoativ,setTipoativ] = useState('');
    const[tempo, setTempo] = useState('');

    const cadastrar = async () => {
        if (!nome || !telefone || !email || !senha || !cpf) {
            alert("Por favor, preencha todos os campos!");
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
            
            const alergiasArray = alergiasinput 
                .split(',')
                .map(item => item.trim())
                .filter(item => item !== '');

            const medicamentosArray = medicamentosinput 
                .split(',')
                .map(item => item.trim())
                .filter(item => item !== '');
            
                const userDocRef = doc(db, "users", userCredential.user.uid);
        
                await setDoc(userDocRef, {
                    nome: nome || '',
                    telefone: telefone || '',
                    email: email || '',
                    cpf: cpf || '',
                    tipo: tipo || 'aluno',
                    birthdate: birthdate || '',
                    cidade: cidade || '',
                    cep: cep || '',
                    bairro: bairro || '',
                    rua: rua || '',
                    numero: numero || '',
                    tiposanguineo: tiposanguineo || '',
                    probsaude: probsaude || '',
                    alergias: alergiasArray,
                    medicamentos: medicamentosArray,
                    probposturais: Boolean(probposturais),
                    riscocardiaco: Boolean(riscocardiaco),
                    doresfrequentes: Boolean(doresfrequentes),
                    contato: contatoemergencia || '',
                    falarcom: falarcom || '',
                    pratica: Boolean(praticaativ),
                    tipoAtiv: tipoativ || '',
                    frequencia: frequenciaativ || '',
                    tempo: tempo || ''
                });
            alert("Cadastro realizado com sucesso!");
            navigation.navigate('Login');
        } catch (error) {
            alert("Erro ao cadastrar: " + error.message);
        }
    };

    const formatarData = (text) => {
        let cleaned = text.replace(/\D/g, '');
        if (cleaned.length <= 2) return cleaned;
        if (cleaned.length <= 4) return cleaned.substring(0, 2) + '/' + cleaned.substring(2);
        return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4) + '/' + cleaned.substring(4, 8);
    };

    // Conteúdo do formulário
    const renderContent = () => (
        <View style={styles.content}>
            <Text style={styles.title}>É novo? Faça seu cadastro</Text>
            <Text style={styles.subtitle}>Preencha um formulário para realizar a inscrição</Text>

            <Text style={styles.descriptionItems}>É aluno ou professor?</Text>
            <Picker selectedValue={tipo} onValueChange={setTipo} style={styles.picker}>
                <Picker.Item label="Aluno" value="aluno" />
                <Picker.Item label="Professor" value="professor" />
            </Picker>

            <TextInput style={styles.input} placeholder="Digite seu E-mail" value={email} onChangeText={setEmail} autoCapitalize="none"/>
            <TextInput style={styles.input} placeholder="Digite sua Senha" value={senha} onChangeText={setSenha} secureTextEntry/>
            <TextInput style={styles.input} placeholder="Nome completo" value={nome} onChangeText={setNome} autoCapitalize="words"/>
            <TextInput style={styles.input} placeholder="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad"/>
            <TextInput style={styles.input} placeholder="CPF" value={cpf} onChangeText={setCpf} keyboardType="numeric"/>
            <TextInput style={styles.input} value={birthdate} placeholder="Data de Nascimento" onChangeText={(t)=>setBirthdate(formatarData(t))} keyboardType="numeric" maxLength={10}/>

            <Text style={styles.descriptionItems}>ENDEREÇO</Text>
            <TextInput style={styles.input} placeholder="CEP" value={cep} onChangeText={setCep} keyboardType="numeric"/>
            <TextInput style={styles.input} placeholder="Cidade" value={cidade} onChangeText={setCidade}/>
            <TextInput style={styles.input} placeholder="Bairro" value={bairro} onChangeText={setBairro}/>
            <TextInput style={styles.input} placeholder="Rua" value={rua} onChangeText={setRua}/>
            <TextInput style={styles.input} placeholder="Número" value={numero} onChangeText={setNumero}/>

            <Text style={styles.titlemiddle}>ANAMNESE</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholder="Alergias (separadas por vírgula)" value={alergiasinput} onChangeText={setAlergiasinput} multiline/>
            <TextInput style={[styles.input, styles.textArea]} placeholder="Medicamentos (separados por vírgula)" value={medicamentosinput} onChangeText={setMedicamentosinput} multiline/>

            <View style={styles.switchContainer}>
                <Text style={styles.switchText}>Possui problemas posturais?</Text>
                <Switch value={probposturais} onValueChange={setProbposturais}/>
            </View>
            <View style={styles.switchContainer}>
                <Text style={styles.switchText}>Possui risco cardíaco?</Text>
                <Switch value={riscocardiaco} onValueChange={setRiscocardiaco}/>
            </View>
            <View style={styles.switchContainer}>
                <Text style={styles.switchText}>Possui dores frequentes?</Text>
                <Switch value={doresfrequentes} onValueChange={setDoresfrequentes}/>
            </View>

            <TextInput style={styles.input} placeholder="Contato de Emergência" value={contatoemergencia} onChangeText={setContatoemergencia}/>
            <TextInput style={styles.input} placeholder="Falar com:" value={falarcom} onChangeText={setFalarcom}/>

            <Text style={styles.titlemiddle}>ATIVIDADE FÍSICA</Text>
            <View style={styles.switchContainer}>
                <Text style={styles.switchText}>Pratica atividade física?</Text>
                <Switch value={praticaativ} onValueChange={setPraticaativ}/>
            </View>
            {praticaativ && (
                <>
                    <TextInput style={styles.input} placeholder="Tipo de atividade" value={tipoativ} onChangeText={setTipoativ}/>
                    <TextInput style={styles.input} placeholder="Frequência" value={frequenciaativ} onChangeText={setFrequenciaativ}/>
                    <TextInput style={styles.input} placeholder="Há quanto tempo?" value={tempo} onChangeText={setTempo}/>
                </>
            )}

            <TouchableOpacity style={styles.botao} onPress={cadastrar}>
                <Text style={styles.botaoTexto}>Cadastrar</Text>
            </TouchableOpacity>
        </View>
    );
    
    if (Platform.OS === 'web') {
        return (
            <div style={{
                height: '100vh',
                overflow: 'auto',
                backgroundColor: '#F7EBE6'
            }}>
                {renderContent()}
            </div>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {renderContent()}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee0d3',
    },
    content: {
        alignItems: 'center',
        paddingVertical: 30,
        paddingHorizontal: 20,
        backgroundColor: '#eee0d3',
        minHeight: Platform.OS === 'web' ? '100vh' : undefined,
    },
    title: { 
        fontSize: Platform.OS === 'web' ? 28 : 22,
        fontWeight: '800', 
        color: '#3d2f49', 
        textAlign: 'center',
        marginBottom: 10 
    },
    subtitle: { 
        fontSize: 13, 
        fontWeight: '800', 
        color: '#3d2f49', 
        textAlign: 'center', 
        marginTop: 6,
        marginBottom: 20
    },
    descriptionItems: { 
        fontSize: 13, 
        fontWeight: '800', 
        color: '#3d2f49', 
        marginTop: 20, 
        textAlign: 'left', 
        width: '90%',
        maxWidth: 400,
    },
    input: { 
        width: '90%',
        maxWidth: 400,
        height: 45, 
        borderColor: '#ccc', 
        borderWidth: 1, 
        borderRadius: 12, 
        backgroundColor: '#fff', 
        marginTop: 15, 
        paddingHorizontal: 10, 
        fontSize: 16, 
        color: '#616161',
    },
    picker: { 
        width: '90%',
        maxWidth: 400,
        height: 45, 
        marginTop: 15, 
        backgroundColor: '#fff', 
        borderRadius: 12, 
        borderWidth: 1, 
        borderColor: '#ccc', 
        color: '#616161'
    },
    botao: { 
        width: '90%',
        maxWidth: 400,
        height: 50, 
        backgroundColor: '#3d2f49', 
        borderRadius: 12, 
        marginTop: 40, 
        marginBottom: 30,
        justifyContent: "center"
    },
    botaoTexto: { 
        color: '#fff', 
        fontSize: 18, 
        fontWeight: 'bold', 
        textAlign: 'center' 
    },
    switchContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        width: '90%',
        maxWidth: 400,
        marginTop: 15,
        paddingHorizontal: 5
    },
    switchText: { 
        fontSize: 14, 
        color: '#3d2f49', 
        fontWeight: '600',
        flex: 1
    },
    titlemiddle: { 
        fontSize: 13, 
        fontWeight: '800', 
        color: '#3d2f49', 
        textAlign: 'center', 
        marginTop: 30,
        marginBottom: 10
    },
    textArea: { 
        height: 80, 
        textAlignVertical: 'top', 
        marginTop: 10,
        paddingTop: 15
    },
});