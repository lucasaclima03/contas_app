// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { MaterialIcons } from '@expo/vector-icons';
// import { Text } from 'react-native';


// const Tab = createBottomTabNavigator();

// function HomeNavigationTabs() {
//   return (
//     <Tab.Navigator 
//         screenOptions={{
//             headerShown: false,
//             tabBarShowLabel: false,
//             unmountOnBlur: false,          
//             tabBarStyle: {
//                 height: 50
//             }  
//         }}
//     >
//       <Tab.Screen
//         name='HomeTab'
//         component={HomeNavigation}
//         options={{
//           headerShown: false,
//           tabBarIcon: ({ color, size, focused }) => (
//             <>
//             <MaterialIcons name='home' color={color} size={26} />
//             <Text style={{color: 'black'}} >Home</Text>
//             </>
//           ),
//         }}
//       />
//       <Tab.Screen
//         name='RegisterReminderTab'
//         component={RegisterReminderNavigation}
//         options={{
//           headerShown: false,
//           tabBarIcon: ({ color, size }) => (
//             <>
//             <MaterialIcons name='add-box' color={color} size={26} />
//             <Text style={{color: 'black'}} >Adicionar Lembrete</Text>
//             </>
//           ),
//         }}
//       />
//       <Tab.Screen
//         name='PaydTab'
//         component={PaydNavigation}
//         options={{
//           headerShown: false,
//           tabBarIcon: ({ color, size }) => (
//             <>
//             <MaterialIcons name='favorite' color={color} size={size} />
//             <Text style={{color: 'black'}} >Contas pagas</Text>
//             </>
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// }
