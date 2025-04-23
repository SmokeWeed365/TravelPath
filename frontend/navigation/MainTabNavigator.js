// navigation/MainTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons }                 from '@expo/vector-icons';
import HomeScreen                   from '../screens/HomeScreen';
import AddCardScreen                from '../screens/AddCardScreen';
import AllMemoryScreen              from '../screens/AllMemoryScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator screenOptions={({route}) => ({
      headerShown: false,
      unmountOnBlur: route.name === 'AddCard',   // <-- รีเซ็ต AddCard ทุกครั้งที่เปลี่ยนแท็บ
      tabBarIcon: ({ focused, color, size }) => {
        let iconName = {
          Home:      focused ? 'home'      : 'home-outline',
          AddCard:   focused ? 'add-circle' : 'add-circle-outline',
          AllMemory: focused ? 'albums'    : 'albums-outline'
        }[route.name];
        return <Ionicons name={iconName} size={size} color={color}/>;
      },
      tabBarActiveTintColor:   '#007AFF',
      tabBarInactiveTintColor: 'gray',
    })}>
      <Tab.Screen name="Home"    component={HomeScreen}/>
      <Tab.Screen name="AddCard" component={AddCardScreen}/>
      <Tab.Screen name="AllMemory" component={AllMemoryScreen}/>
    </Tab.Navigator>
  );
}
