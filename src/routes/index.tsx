import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
// import { StackRoutes, TabRoutes } from './routes';
import DrawerNavigation from './DrawerNavigation';

export function Routes(){
    return (
        <NavigationContainer>
            {/* <StackRoutes /> */}
            {/* <ShowBottomTabs/> */}
            <DrawerNavigation/>
        </NavigationContainer>
    )
}