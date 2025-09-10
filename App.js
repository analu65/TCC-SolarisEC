import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, cardStyleInterpolator, CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import HomeProfessor from './screens/HomeProfessor';
import HomeAluno from './screens/HomeAluno';
import Avisos from './screens/Avisos';
import Selection from './screens/selection';
import { StatusBar } from 'expo-status-bar';
import SignUp from './screens/SignUp';
import Login from './screens/Login';
import Teste from './screens/screenteste';
import EmailComposerScreen from './screens/emailComposerScreen';
import { useState } from 'react';
function BottomTabProfessor(){
  const BottomTab = createBottomTabNavigator();
  return (
            <BottomTab.Navigator screenOptions={{
            animation: 'shift',
            tabBarActiveTintColor: '#dd6a71', //cor do texto que está ativo
            tabBarInactiveTintColor:'#dd6a71',
            tabBarInactiveBackgroundColor: '#ffffff',
            tabBarActiveBackgroundColor: '#d3d3d3', //cor de fundo da aba ativa
            tabBarLabelStyle: {
              marginBottom: -2
            }
          }}>
                <BottomTab.Screen name='ProfessorTab' component={HomeProfessor} options={{tabBarIcon: () => (<MaterialCommunityIcons name="home" size={20} color="#dd6a71" />), header: () => null}}></BottomTab.Screen>
                <BottomTab.Screen name='Email' component={EmailComposerScreen} options={{tabBarIcon: () => (<MaterialCommunityIcons name="bell" size={20} color="#dd6a71" />), header: () => null}}></BottomTab.Screen>
            </BottomTab.Navigator>
  );
}

function BottomTabAluno(){
  const BottomTab = createBottomTabNavigator();
  return (
            <BottomTab.Navigator screenOptions={{
            animation: 'shift',
            tabBarActiveTintColor: '#dd6a71', //cor do texto que está ativo
            tabBarInactiveTintColor:'#dd6a71',
            tabBarInactiveBackgroundColor: '#ffffff',
            tabBarActiveBackgroundColor: '#d3d3d3', //cor de fundo da aba ativa
            tabBarLabelStyle: {
              marginBottom: -2
            }
          }}>
                <BottomTab.Screen name='AlunoTab' component={HomeAluno} options={{tabBarIcon: () => (<MaterialCommunityIcons name="home" size={20} color="#dd6a71" />), header: () => null}}></BottomTab.Screen>
                <BottomTab.Screen name='Avisos' component={Avisos} options={{tabBarIcon: () => (<MaterialCommunityIcons name="bell" size={20} color="#dd6a71" />), header: () => null}}></BottomTab.Screen>
            </BottomTab.Navigator>
  );
}

export default function App() {
  const Stack = createStackNavigator();
  <StatusBar style="auto" />
    return(
        <NavigationContainer>
          <Stack.Navigator screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
      }}>
            <Stack.Screen options={{headerShown: false}} name='Selection' component={Selection}></Stack.Screen>
            <Stack.Screen name='Login' component={Login}></Stack.Screen>
            <Stack.Screen name='SignUp' component={SignUp}></Stack.Screen>
            <Stack.Screen options={{headerShown: false}} name = 'HomeAluno' component={BottomTabAluno}></Stack.Screen>
            <Stack.Screen options={{headerShown: false}} name = 'HomeProfessor' component={BottomTabProfessor}></Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});