// navigation/RootNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen        from '../screens/SplashScreen';
import MainTabNavigator    from './MainTabNavigator';
import MemoryDetailScreen  from '../screens/MemoryDetailScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash"       component={SplashScreen} />
      <Stack.Screen name="MainTabs"     component={MainTabNavigator} />
      <Stack.Screen name="MemoryDetail" component={MemoryDetailScreen} />
    </Stack.Navigator>
  );
}
