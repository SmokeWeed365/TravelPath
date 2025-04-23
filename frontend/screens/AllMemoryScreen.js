// screens/AllMemoryScreen.js
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Header from '../components/Header';
import MemoryCard from '../components/MemoryCard';
import PlaceholderCard from '../components/PlaceholderCard';
import api from '../api';

export default function AllMemoryScreen({ navigation }) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading]   = useState(true);
  const isFocused = useIsFocused();

  // ฟังก์ชันดึงข้อมูล
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

  // เมื่อหน้าโฟกัส (มาจาก delete หรือกลับมาหน้านี้) ให้รีเฟรช
  useEffect(() => {
    if (isFocused) fetchMemories();
  }, [isFocused]);

  // data สำหรับ placeholder
  const placeholderData = Array.from({ length: 20 }).map((_, i) => ({ key: `p${i}` }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="All Memories" onBack={() => navigation.goBack()} />

      {loading ? (
        <FlatList
          data={placeholderData}
          keyExtractor={item => item.key}
          numColumns={2}
          renderItem={() => <PlaceholderCard />}
          contentContainerStyle={styles.list}
        />
      ) : (
        <FlatList
          data={memories}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <MemoryCard
              memory={item}
              onPress={() =>
                navigation.navigate('MemoryDetail', { id: item.id })
              }
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  list:     {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16
  }
});
