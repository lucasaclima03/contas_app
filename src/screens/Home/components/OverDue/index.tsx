import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function OverDue(){
    return (
        <SafeAreaView>
            <StatusBar style='auto' />
            <Text>Contas vencidas</Text>
        </SafeAreaView>
    )
}