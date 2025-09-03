import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, cardStyleInterpolator, CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Home from './screens/Home';
import Avisos from './screens/Avisos';
import Selection from './screens/selection';
import { StatusBar } from 'expo-status-bar';
import SignUp from './screens/SignUp';
import Login from './screens/Login';
import Teste from './screens/screenteste';

import EmailComposerScreen from './screens/emailComposerScreen';
function BottomTabs(){
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
                <BottomTab.Screen name='Home' component={Home} options={{tabBarIcon: () => (<MaterialCommunityIcons name="home" size={20} color="
#dd6a71" />), header: () => null}}></BottomTab.Screen>
                <BottomTab.Screen name='Teste' component={Teste} options={{tabBarIcon: () => (<MaterialCommunityIcons name="bell" size={20} color="
#dd6a71" />), header: () => null}}></BottomTab.Screen>
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
            <Stack.Screen options={{headerShown: false}} name = 'HomeTab' component={BottomTabs}></Stack.Screen>
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