import React, { useEffect } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('MainTabs'), 60000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ImageBackground
      source={require('../assets/login-bg.png')}
      style={styles.container}
    >
      <Text style={styles.title}>TravelPath</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace('MainTabs')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center' },
  title:     { fontSize:32, color:'#000', marginBottom:20 },
  button:    { backgroundColor:'#007AFF', padding:12, borderRadius:8 },
  buttonText:{ color:'#fff', fontSize:16 }
});
