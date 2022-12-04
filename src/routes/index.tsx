import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
// import { StackRoutes, TabRoutes } from './routes';
import ShowBottomTabs from './BottomTabs';

export function Routes(){
    return (
        <NavigationContainer>
            {/* <StackRoutes /> */}
            <ShowBottomTabs/>
        </NavigationContainer>
    )
}