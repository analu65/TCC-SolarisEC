import { StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import HomeProfessor from './screens/HomeProfessor';
import HomeAluno from './screens/HomeAluno';
import Avisos from './screens/Avisos';
import CadastroTurmas from './screens/cadastroTurmas';
import Turmas from './screens/turmas';
import AnamneseProfalunos from './screens/anamneseProfAlunos';
import AnamneseProfessor from './screens/anamneseProfessor';
import Selection from './screens/selection';
import { StatusBar } from 'expo-status-bar';
import SignUp from './screens/SignUp';
import Login from './screens/Login';
import EmailComposerScreen from './screens/emailComposerScreen';
import cadastroTurmas from './screens/cadastroTurmas';

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
          headerShown: false
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
          headerShown: false
        }}
      />
    </BottomTab.Navigator>
  );
}

function DrawerProfessor() {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <View style={{ flex: 1, paddingTop: 50 }}>
          <DrawerItemList {...props} />
          <TouchableOpacity
            style={{
              padding: 15,
              backgroundColor: '#3d2f49',
              margin: 10,
              borderRadius: 5,
              marginBottom: 20
            }}
            onPress={() => props.navigation.navigate('Selection')}>
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Sair</Text>
          </TouchableOpacity>
        </View>
      )}
    >
      <Drawer.Screen 
        name='HomeProfessorDrawer' 
        component={BottomTabProfessor} 
        options={{ title: 'Início' }}
      />
    </Drawer.Navigator>
  );
}


function DrawerAluno() {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <View style={{ flex: 1, paddingTop: 50 }}>
          <DrawerItemList {...props} />
          
          <TouchableOpacity
            style={{
              padding: 15,
              backgroundColor: '#3d2f49',
              margin: 10,
              borderRadius: 5,
              marginBottom: 20
            }}
            onPress={() => props.navigation.navigate('Login')}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
              Sair
            </Text>
          </TouchableOpacity>
        </View>
      )}
    >
      <Drawer.Screen 
        name='HomeAlunoDrawer' 
        component={BottomTabAluno} 
        options={{ title: 'Início' }}
      />
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
          headerTintColor: '#3d2f49',
        }}>
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
        <Stack.Screen 
          name='AnamneseProfessor' 
          component={AnamneseProfessor} 
        />
        <Stack.Screen 
          name='Turmas' 
          component={Turmas} 
        />
        <Stack.Screen 
          name='AnamneseProfalunos' 
          component={AnamneseProfalunos} 
        />
        <Stack.Screen 
          name='CadastroTurmas' 
          component={CadastroTurmas} 
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