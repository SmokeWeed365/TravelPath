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
  View,
  Platform
} from 'react-native';
import Constants from 'expo-constants';
import Header from '../components/Header';
import api    from '../api';

export default function MemoryDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [memory, setMemory] = useState(null);

  // โหลดข้อมูลซ้ำเมื่อ id เปลี่ยน
  useEffect(() => {
    api.get(`/memories/${id}`)
      .then(res => setMemory(res.data))
      .catch(err => console.error('Fetch detail error:', err.message));
  }, [id]);

  // หาค่า host อัตโนมัติจาก Expo Constants
  const manifest   = Constants.manifest || Constants.manifest2 || {};
  const hostUri    = manifest.debuggerHost || manifest.hostUri || 'localhost:19000';
  let host         = hostUri.split(':')[0];
  if (Platform.OS === 'android' && host === 'localhost') {
    host = '10.0.2.2';
  }

  if (!memory) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.loading}>Loading...</Text>
      </SafeAreaView>
    );
  }

  // สร้าง full URL ของรูป
  const imageUrl = memory.image_url
    ? `http://${host}:3000${memory.image_url}`
    : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Header title="Detail" onBack={() => navigation.goBack()} />

        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
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
          <View style={styles.buttons}>
            <Button
              title="Edit"
              onPress={() =>
                navigation.navigate('MainTabs', {
                  screen: 'AddCard',
                  params: memory
                })
              }
            />
            <View style={styles.spacer} />
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea:     { flex: 1, backgroundColor: '#FFF' },
  container:    { flex: 1, paddingTop: 16 },
  loading:      { flex: 1, textAlign: 'center', marginTop: 20 },
  image:        { width: '100%', height: 200 },
  noImageDetail:{ 
    width: '100%', 
    height: 200, 
    justifyContent: 'center',
    alignItems: 'center', 
    backgroundColor: '#EEEDED' 
  },
  noImageText:  { color: '#AAA' },
  content:      { padding: 16 },
  title:        { fontSize: 24, fontWeight: '600', marginBottom: 8 },
  place:        { fontSize: 16, color: 'gray', marginBottom: 12 },
  description:  { fontSize: 14, lineHeight: 20, marginBottom: 24 },
  buttons:      { flexDirection: 'row', justifyContent: 'space-between' },
  spacer:       { width: 16 }
});
