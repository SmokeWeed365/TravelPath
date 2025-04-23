import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import MemoryCard from '../components/MemoryCard';
import PlaceholderCard from '../components/PlaceholderCard';
import api from '../api';

export default function HomeScreen({ navigation }) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading]   = useState(true);
  const isFocused = useIsFocused();

  // ฟังก์ชันดึงข้อมูลจาก API
  async function fetchMemories() {
    setLoading(true);
    try {
      const res = await api.get('/memories');
      setMemories(res.data.data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  // รีเฟรชทุกครั้งที่โฟกัสเข้าหน้านี้ใหม่
  useEffect(() => {
    if (isFocused) fetchMemories();
  }, [isFocused]);

  // placeholder สร้างการ์ดเปล่า 6 ใบ
  const placeholderData = Array.from({ length: 6 }).map((_, i) => ({ key: `h${i}` }));

  // ระหว่างกำลังโหลด
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator style={styles.loader} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* แถบ header ไม่มี back */}
      <Header title="Home" />

      {/* 1. Top row: Explore Natural + + button */}
      <View style={styles.topRow}>
        <Text style={styles.subtitle}>
          Explore <Text style={styles.highlight}>Natural</Text>
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddCard')}
          style={styles.plusBtn}
        >
          <Ionicons name="add-circle" size={28} color="#757575" />
        </TouchableOpacity>
      </View>

      {/* 2. Main title */}
      <Text style={styles.mainTitle}>Beauty of the Earth.</Text>

      {/* 3. Album row: label + view all */}
      <View style={styles.albumRow}>
        <Text style={styles.albumLabel}>Album</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AllMemory')}>
          <Text style={styles.viewAll}>view all</Text>
        </TouchableOpacity>
      </View>

      {/* 4. Grid list */}
      <FlatList
        data={memories.length > 0 ? memories : placeholderData}
        keyExtractor={item => item.id?.toString() ?? item.key}
        numColumns={2}
        renderItem={({ item }) => {
          return memories.length > 0 ? (
            <MemoryCard
              memory={item}
              onPress={() =>
                navigation.navigate('MemoryDetail', { id: item.id })
              }
            />
          ) : (
            <PlaceholderCard />
          );
        }}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea:   { flex: 1, backgroundColor: '#FFF' },
  loader:     { flex: 1, justifyContent: 'center', alignItems: 'center' },
  topRow:     { flexDirection: 'row', alignItems: 'center', paddingHorizontal:16, paddingTop:16 },
  subtitle:   { flex: 1, fontSize: 14, color: '#757575' },
  highlight:  { color: '#75C27E' },
  plusBtn:    { paddingLeft: 8 },
  mainTitle:  { fontSize: 24, fontWeight: '700', color: '#333', paddingHorizontal:16, marginTop:8, marginBottom:16 },
  albumRow:   { flexDirection: 'row', alignItems: 'center', paddingHorizontal:16, marginBottom:8 },
  albumLabel: { flex: 1, fontSize: 16, fontWeight: '600', color: '#333' },
  viewAll:    { fontSize: 12, color: '#757575' },
  list:       { paddingHorizontal: 16, paddingBottom: 16 },
});
