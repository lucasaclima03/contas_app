import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StackRoutes, TabRoutes } from './routes';


export function Routes(){
    return (
        <NavigationContainer>
            <StackRoutes />
        </NavigationContainer>
    )
}