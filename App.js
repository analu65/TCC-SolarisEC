import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import HomeProfessor from './screens/HomeProfessor';
import HomeAluno from './screens/HomeAluno';
import Avisos from './screens/Avisos';
import Turmas from './screens/turmas';
import AnamneseAluno from './screens/anamnese';
import AnamneseProfessor from './screens/anamneseProfessor';
import Selection from './screens/selection';
import { StatusBar } from 'expo-status-bar';
import SignUp from './screens/SignUp';
import Login from './screens/Login';
import EmailComposerScreen from './screens/emailComposerScreen';
import cadastroTurmas from './screens/cadastroTurmas';
import AnamneseProfalunos from './screens/anamneseProfAlunos';

// Bottom Tab para Professor
function BottomTabProfessor() {
  const BottomTab = createBottomTabNavigator();
  return (
    <BottomTab.Navigator screenOptions={{
      animation: 'shift',
      tabBarActiveTintColor: '#dd6a71',
      tabBarInactiveTintColor: '#dd6a71',
      tabBarInactiveBackgroundColor: '#ffffff',
      tabBarActiveBackgroundColor: '#d3d3d3',
      tabBarLabelStyle: {
        marginBottom: -2
      }
    }}>
      <BottomTab.Screen 
        name='Home' 
        component={HomeProfessor} 
        options={{
          tabBarIcon: () => (<MaterialCommunityIcons name="home" size={20} color="#dd6a71" />), 
          headerShown: false
        }}
      />
      <BottomTab.Screen 
        name='Email' 
        component={EmailComposerScreen} 
        options={{
          tabBarIcon: () => (<MaterialCommunityIcons name="email" size={20} color="#dd6a71" />), 
          headerShown: ''
        }}
      />
    </BottomTab.Navigator>
  );
}

function BottomTabAluno() {
  const BottomTab = createBottomTabNavigator();
  return (
    <BottomTab.Navigator screenOptions={{
      animation: 'shift',
      tabBarActiveTintColor: '#dd6a71',
      tabBarInactiveTintColor: '#dd6a71',
      tabBarInactiveBackgroundColor: '#ffffff',
      tabBarActiveBackgroundColor: '#d3d3d3',
      tabBarLabelStyle: {
        marginBottom: -2
      }
    }}>
      <BottomTab.Screen 
        name='Home' 
        component={HomeAluno} 
        options={{
          tabBarIcon: () => (<MaterialCommunityIcons name="home" size={20} color="#dd6a71" />), 
          headerShown: false
        }}
      />
      <BottomTab.Screen 
        name='Avisos' 
        component={Avisos} 
        options={{
          tabBarIcon: () => (<MaterialCommunityIcons name="bell" size={20} color="#dd6a71" />), 
          headerShown: ''
        }}
      />
    </BottomTab.Navigator>
  );
}

function DrawerProfessor() {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator>
      <Drawer.Screen 
        name='HomeProfessorDrawer' 
        component={BottomTabProfessor} 
        options={{ title: 'Início' }}
      />
      <Drawer.Screen name='Turmas' component={Turmas} />
      <Drawer.Screen name='CadastroTurmas' component={cadastroTurmas} />
      <Drawer.Screen name='Anamnese' component={AnamneseProfessor}/>
      <Drawer.Screen name='Anamneseprofessoraluno' component={AnamneseProfalunos}/>
    </Drawer.Navigator>
  );
}

function DrawerAluno() {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator>
      <Drawer.Screen 
        name='HomeAlunoDrawer' 
        component={BottomTabAluno} 
        options={{ title: 'Início' }}
      />
      <Drawer.Screen name='Anamnese' component={AnamneseAluno}/>
    </Drawer.Navigator>
  );
}

export default function App() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator 
        screenOptions={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          headerStyle: {
            backgroundColor: '#FAF1ED',
          },
          headerTitle: '',
          headerTintColor: '#3d2f49'
        }}
      >
        <Stack.Screen 
          options={{headerShown: false}} 
          name='Selection' 
          component={Selection} 
        />
        <Stack.Screen 
          name='Login' 
          component={Login} 
          options={{ 
            title: 'Login',
          }}
        />
        <Stack.Screen 
          name='SignUp' 
          component={SignUp} 
          options={{ 
            title: 'Criar Conta',
          }}
        />
        <Stack.Screen 
          options={{headerShown: false}} 
          name='HomeAluno' 
          component={DrawerAluno} 
        />
        <Stack.Screen 
          options={{headerShown: false}} 
          name='HomeProfessor' 
          component={DrawerProfessor} 
        />
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