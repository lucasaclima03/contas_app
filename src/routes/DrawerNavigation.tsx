import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import StackNavigation, {
  HomeNavigation,
  HomeNavigationTabs,
  PaydNavigation,
  RegisterReminderNavigation,
} from './StackNavigation';
import { WhoWeAre } from '../screens';
import { Home } from '../screens';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { RegisterReminder } from '../screens';

const Drawer = createDrawerNavigator();

const Tab = createBottomTabNavigator();

function DrawerNavigationTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        unmountOnBlur: false,
        tabBarStyle: {
          height: 50,
        },
      }}
    >
      <Tab.Screen
        name='HomeTab'
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <>
              <MaterialIcons name='home' color={color} size={26} />
              <Text style={{ color: 'black' }}>Home</Text>
            </>
          ),
        }}
      />
      <Tab.Screen
        name='RegisterReminderTab'
        component={RegisterReminder}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <>
              <MaterialIcons name='add-box' color={color} size={26} />
              <Text style={{ color: 'black' }}>Adicionar Lembrete</Text>
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
              <Text style={{ color: 'black' }}>Contas pagas</Text>
            </>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default (props) => (
  <Drawer.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName='WhoWeAre'
  >
    <Drawer.Screen name='HomeDrawer' component={StackNavigation} options={{        
        headerTitleAlign: 'center',
        title: 'Home'
      }} />
    <Drawer.Screen
      name='Quem Somos'
      component={WhoWeAre}
      
      options={{
        headerShown: true,
        headerTitleAlign: 'center',
        title: 'Quem somos'
      }}
    />
  </Drawer.Navigator>
);
