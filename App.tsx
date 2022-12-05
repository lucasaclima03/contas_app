import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Routes } from './src/routes/index';
import Reminder from './src/screens/Calendar';

export default function App() {
  return (

    // <Routes/>
    <Reminder />
    // <View style={styles.container}>
    //   <Text>Open up App.js to start working on your app! aaaade</Text>
    //   <StatusBar style="auto" />
    // </View>
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
