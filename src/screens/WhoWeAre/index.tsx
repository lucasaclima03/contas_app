import React from 'react';
import { SafeAreaView, Text, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function WhoWeAre(){
    return (
        <SafeAreaView>
            <StatusBar style='auto' />
            <Text style={styles.headerText} > Olá! </Text>
            <Text style={styles.text}>Obrigado por usar nosso app! Lucas é desenvolvedor de softwares e Camila UX/UI designer. Juntos criamos esse app para facilitar o controle financeiro das pessoas. </Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({       
   
    container: {
    //   padding: 10,
    //   marginBottom: 5,          
    //   justifyContent: 'center',
    },        
    headerText: {
      fontSize: 25,
      color: 'black',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
      marginTop: 15
    },    
    text: {
      fontSize: 20,      
      textAlign: 'justify',
      marginHorizontal: 15,
      color: 'black'
      
    },
    
  });