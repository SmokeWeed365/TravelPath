// frontend/screens/MemoryDetailScreen.js
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScrollView,
  Text,
  Image,
  Button,
  Alert,
  StyleSheet,
  View
} from 'react-native';
import Header from '../components/Header';
import api    from '../api';

export default function MemoryDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [memory, setMemory] = useState(null);

  useEffect(() => {
    api.get(`/memories/${id}`)
      .then(res => setMemory(res.data))
      .catch(err => console.error(err.message));
  }, []);

  if (!memory) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.loading}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Header title="Detail" onBack={() => navigation.goBack()} />

        {memory.image_url ? (
          <Image
            source={{ uri: `http://localhost:3000${memory.image_url}` }}
            style={styles.image}
          />
        ) : (
          <View style={styles.noImageDetail}>
            <Text style={styles.noImageText}>ไม่มีรูปให้แสดง</Text>
          </View>
        )}

        <View style={styles.content}>
          <Text style={styles.title}>{memory.title}</Text>
          <Text style={styles.place}>{memory.place}</Text>
          <Text style={styles.description}>{memory.description}</Text>
          <Button
            title="Edit"
            onPress={() => navigation.navigate('MainTabs', {
              screen: 'AddCard',
              params: memory
            })}
          />
          <Button
            title="Delete"
            color="red"
            onPress={async () => {
              try {
                await api.delete(`/memories/${id}`);
                navigation.popToTop();
              } catch {
                Alert.alert('ลบไม่สำเร็จ');
              }
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea:     { flex:1, backgroundColor:'#FFF' },
  container:    { flex:1, paddingTop:16 },
  loading:      { flex:1, textAlign:'center', marginTop:20 },
  image:        { width:'100%', height:200 },
  noImageDetail:{ width:'100%', height:200, justifyContent:'center',
                  alignItems:'center', backgroundColor:'#EEEDED' },
  noImageText:  { color:'#AAA' },
  content:      { padding:16 },
  title:        { fontSize:24, fontWeight:'600', marginBottom:8 },
  place:        { fontSize:16, color:'gray', marginBottom:12 },
  description:  { fontSize:14, lineHeight:20, marginBottom:24 }
});
