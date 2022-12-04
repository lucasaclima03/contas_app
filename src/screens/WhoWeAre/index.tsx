import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function WhoWeAre(){
    return (
        <SafeAreaView>
            <StatusBar style='auto' />
            <Text>Quem Somos</Text>
        </SafeAreaView>
    )
}