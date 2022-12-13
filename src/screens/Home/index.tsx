import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, Text, View } from 'react-native';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import { database } from '../../database';

import NearToDueDate from './components/NearToDueDate';
import OverDue from './components/OverDue';
import Payd from './components/Payd';
import { Q } from '@nozbe/watermelondb';

const Tab = createMaterialTopTabNavigator();

export function Home() {
  const [savedReminders, setSavedReminders] = useState();
  const [overDueBills, setOverDueBills] = useState();
  const [paydBills, setPaydBills] = useState();

  const [date, setDate] = useState(new Date());

  const day = date.getDate();

  const getReminders = async () => {
    const remindersCollection = database.get('reminder');
    const response = await remindersCollection
      .query(Q.where('payd', 0))
      .fetch();
    setSavedReminders(response);
  };


  const getPaydBills = async () => {
    const remindersCollection = database.get('reminder');
    const response = await remindersCollection
      .query(Q.where('payd', 1))
      .fetch();
    setPaydBills(response);
  };

  const getOverDueBills = async () => {
    const remindersCollection = database.get('reminder');    
    const response = await remindersCollection
      .query(Q.where('payd', 0), Q.where('day', Q.lt(day)))
      .fetch();

    setOverDueBills(response);
  };
  
  useEffect(
    useCallback(() => {
      getReminders();
      getPaydBills();
      getOverDueBills()
    }, []),
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      <Tab.Navigator
        initialRouteName='Feed'
        screenOptions={{
          tabBarIndicatorStyle: {
            backgroundColor: 'white',
            width: 50,
            marginLeft: 38,
          },
          tabBarInactiveTintColor: '#c2c2c2',
          tabBarActiveTintColor: 'white',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
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
          name='NearToDueDate'
          component={NearToDueDate}
          options={{ tabBarLabel: `A vencer (${savedReminders?.length})` }}
        />
        <Tab.Screen
          name='Notifications'
          component={Payd}
          options={{ tabBarLabel: `Pagas (${paydBills?.length})` }}
        />
        <Tab.Screen
          name='Profile'
          component={OverDue}
          options={{ tabBarLabel: `Atrasadas (${overDueBills?.length})` }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
