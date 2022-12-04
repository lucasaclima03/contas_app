import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';

import NearToDueDate from './components/NearToDueDate';
import OverDue from './components/OverDue';
import Payd from './components/Payd';


const Tab = createMaterialTopTabNavigator();


export function Home() {
  return (
    <Tab.Navigator
      initialRouteName="Feed"            
      screenOptions={{
        tabBarInactiveTintColor: '#91918e',        
        tabBarActiveTintColor: 'white',         
        tabBarLabelStyle: { 
          fontSize: 12,
          fontWeight: 'bold'

        },
        tabBarStyle: { 
          backgroundColor: '#8B008B',
        },        
      }}
    >
      <Tab.Screen
        name="Feed"
        component={NearToDueDate}
        options={{ tabBarLabel: 'A vencer' }}
      />
      <Tab.Screen
        name="Notifications"
        component={Payd}
        options={{ tabBarLabel: 'Pagas' }}
      />
      <Tab.Screen
        name="Profile"
        component={OverDue}
        options={{ tabBarLabel: 'Atrasadas' }}
      />
    </Tab.Navigator>
  );
}