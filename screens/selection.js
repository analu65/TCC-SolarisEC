import { StyleSheet, View, Button, ImageBackground, Text, Animated, TouchableOpacity } from "react-native";
import React from 'react';


export default function Selection({navigation}){
    return(
        <View style={styles.container}>
            {/*<ImageBackground source={require('../fotossolaris/begemelhor2.png')} style={styles.imgbackground}>*/}
                

                <Text style={styles.titulo}> Bem-vindo! </Text>


                {/* container dos botoes */}
                <View style={styles.botoescircocontainer}>
                    
                    {/* botao de login */}
                    <View style={styles.loginbotaocontainer}>
                        <TouchableOpacity 
                            style={styles.botaologin}
                            onPress={() => navigation.navigate('Login')}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.botaologintexto}>Já tenho cadastro</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity 
                        style={styles.circosignupbotao}
                        onPress={() => navigation.navigate('SignUp')}
                        activeOpacity={0.8} //opacidade quando ele ta ativo, quando aperta o botão
                    >
                        <Text style={styles.registerButtonText}>Quero me cadastrar</Text>
                    </TouchableOpacity>
                </View>

            {/*</ImageBackground>*/}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FCF9F7', 
        justifyContent: 'center', 
        alignItems: 'center',
    }, 
    imgbackground: { //guarda p depois botar a image sla
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }, 
    buttonsignup: {
    },


    titulo: {
        fontSize: 24,
        fontWeight: '800',
        color: '#3d2f49',
        marginBottom: 20, 
        marginTop: 100, 
        textAlign: 'center',
        textShadowColor: 'rgba(61, 47, 73, 0.3)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    


    botoescircocontainer: {
        alignItems: 'center',
        width: '85%',
        marginBottom: 20,
    },


    loginbotaocontainer: {
        width: '100%',
        marginBottom: 15,
    },
    

    botaologin: {
        backgroundColor: '#dd6b70',
        paddingVertical: 16,
        paddingHorizontal: 25,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#3d2f49',
        elevation: 8,
        shadowColor: '#3d2f49',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    
    circosignupbotao: {
        backgroundColor: '#3d2f49',
        paddingVertical: 16,
        paddingHorizontal: 25,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#dd6b70',
        width: '100%',
        elevation: 8,
        shadowColor: '#dd6b70',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    
    botaologintexto: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
    },
    
    registerButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
    },
    
    
    starsContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
    },
    
    star: {
        position: 'absolute',
        fontSize: 20,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 1, height: 1 },
    },
    
});