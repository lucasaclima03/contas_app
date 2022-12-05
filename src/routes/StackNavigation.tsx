import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, WhoWeAre, RegisterReminder, Payd } from '../screens';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';

//import HomeNavigationTabs from './BottomTabs';
import Login from '../screens/Login';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();  


export default (props) => (
  <Stack.Navigator
    initialRouteName='Login'
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name='Login' component={Login} />
    <Stack.Screen name='Home' component={HomeNavigationTabs} />    
  </Stack.Navigator>
);

export function HomeNavigationTabs() {
    return (
      <Tab.Navigator 
          screenOptions={{
              headerShown: false,
              tabBarShowLabel: false,
              unmountOnBlur: false,          
              tabBarStyle: {
                  height: 50
              }  
          }}
      >
        <Tab.Screen
          name='HomeTab'
          component={HomeNavigation}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) => (
              <>
              <MaterialIcons name='home' color={color} size={26} />
              <Text style={{color: 'black'}} >Home</Text>
              </>
            ),
          }}
        />
        <Tab.Screen
          name='RegisterReminderTab'
          component={RegisterReminderNavigation}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <>
              <MaterialIcons name='add-box' color={color} size={26} />
              <Text style={{color: 'black'}} >Adicionar Lembrete</Text>
              </>
            ),
          }}
        />
        <Tab.Screen
          name='PaydTab'
          component={PaydNavigation}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <>
              <MaterialIcons name='favorite' color={color} size={size} />
              <Text style={{color: 'black'}} >Contas pagas</Text>
              </>
            ),
          }}
        />
      </Tab.Navigator>
    );
  }

export function HomeNavigation({navigation}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        title: 'Tela Home',
        headerTitleAlign: 'center',
        headerLeft: () => (
          <View style={{ margin: 5 }}>
            <MaterialIcons
              name='menu'
              size={25}
              onPress={() => navigation.openDrawer()  }              
            />
          </View>
        ),
      }}
    >
      <Stack.Screen name='HomeNavigation' component={Home} />
    </Stack.Navigator>
  );
}

export function RegisterReminderNavigation({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        title: 'Adicionar lembrete',
        headerTitleAlign: 'center',
        headerLeft: () => (
          <View style={{ margin: 5 }}>
            <MaterialIcons
              name='menu'
              size={25}
              onPress={() => navigation.openDrawer()}
            />
          </View>
        ),
      }}
    >
      <Stack.Screen
        name='RegisterReminderNavigation'
        component={RegisterReminder}
      />
    </Stack.Navigator>
  );
}

export function PaydNavigation({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        title: 'Contas Pagas',
        headerTitleAlign: 'center',
        headerLeft: () => (
          <View style={{ margin: 5 }}>
            <MaterialIcons
              name='menu'
              size={25}
              onPress={() => navigation.openDrawer()}
            />
          </View>
        ),
      }}
    >
      <Stack.Screen name='PaydNavigation' component={Payd} />
    </Stack.Navigator>
  );
}
