import * as React from 'react';
import { StyleSheet, SafeAreaView, Text, View } from 'react-native';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';

import NearToDueDate from './components/NearToDueDate';
import OverDue from './components/OverDue';
import Payd from './components/Payd';


const Tab = createMaterialTopTabNavigator();


export function Home() {
  // useFocusEffect(
  //   useCallback(() => {
  //     getReminders();
  //   }, []),
  // );
  return (
    <SafeAreaView style={styles.container}>
      <Tab.Navigator    
        initialRouteName="Feed"            
        screenOptions={{        
          tabBarIndicatorStyle: {
            backgroundColor: 'white',
            width: 50,
            marginLeft: 38
          },                
          tabBarInactiveTintColor: '#c2c2c2',        
          tabBarActiveTintColor: 'white',
          tabBarLabelStyle: { 
            fontSize: 12,
            fontWeight: 'bold'
          },
          tabBarStyle: { 
            backgroundColor: '#8B008B',          
            marginHorizontal: '3%',
            marginTop: 10,
            marginBottom: 8,            
            borderRadius: 8,          
            elevation: 15,            
            
            
            
          },        
        }}
      >
        <Tab.Screen
          name="NearToDueDate"
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',    
  }
})