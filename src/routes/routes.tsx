import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { MaterialIcons } from '@expo/vector-icons';

import { createDrawerNavigator } from '@react-navigation/drawer';

import { Home } from '../screens/Home';
import Payd from '../screens/Payd';
import NearToDueDate from '../screens/NearToDueDate';
import OverDue from '../screens/OverDue';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WhoWeAre from '../screens/WhoWeAre';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { View, Text } from 'react-native';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();


export function StackRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='tab-stack'
        component={TabRoutes}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function DrawerRoutes() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#4b8582',
        },
        drawerActiveTintColor: 'white',
        drawerInactiveTintColor: 'white',
        drawerLabelStyle: {
          fontSize: 18,
          alignContent: 'center',
        },
      }}
    >
      <Drawer.Screen name='Minhas contas' component={Home} />
      <Drawer.Screen name='Quem Somos' component={WhoWeAre} />
    </Drawer.Navigator>
  );
}

export function TabRoutes() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name='Home'
        component={DrawerRoutes}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='home' color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name='Adicionar'
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='add-box' color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name='Contas pagas'
        component={Payd}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='favorite' color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
