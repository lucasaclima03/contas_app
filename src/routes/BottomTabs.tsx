import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import {
  HomeNavigation,
  RegisterReminderNavigation,
  PaydNavigation,
} from './StackNavigation';

const Tab = createBottomTabNavigator();

export default function ShowBottomTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name='Home'
        component={HomeNavigation}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='home' color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name='Adicionar'
        component={RegisterReminderNavigation}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='add-box' color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name='Contas Pagas'
        component={PaydNavigation}
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
