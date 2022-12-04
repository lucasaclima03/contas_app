import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function NearToDueDate(){
    return (
        <SafeAreaView>
            <StatusBar style="auto" />
            <Text>Proximas do vencimento</Text>
        </SafeAreaView>
    )
}