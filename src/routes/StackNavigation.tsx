import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {Home, WhoWeAre, RegisterReminder, Payd } from '../screens'

const Stack = createNativeStackNavigator()

export function HomeNavigation(){
    return (
        <Stack.Navigator>
            <Stack.Screen name='HomeNavigation' component={Home} />
        </Stack.Navigator>
    )
}

export function RegisterReminderNavigation(){
    return (
        <Stack.Navigator>
            <Stack.Screen name='RegisterReminderNavigation' component={RegisterReminder} />
        </Stack.Navigator>
    )
}

export function PaydNavigation(){
    return (
        <Stack.Navigator>
            <Stack.Screen name='PaydNavigation' component={Payd} />
        </Stack.Navigator>
    )
}