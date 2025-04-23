// components/MemoryCard.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function MemoryCard({ memory, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {memory.image_url ? (
        <Image
          source={{ uri: memory.image_url.startsWith('http') 
                    ? memory.image_url 
                    : `http://localhost:3000${memory.image_url}` }}
          style={styles.image}
        />
      ) : (
        <View style={[styles.image, styles.placeholder]} />
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {memory.title}
        </Text>
        <Text style={styles.place} numberOfLines={1}>
          {memory.place}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    margin: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 2, // shadow สำหรับ Android
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width:0, height:2 },
  },
  image: {
    width: '100%',
    height: 100,
  },
  placeholder: {
    backgroundColor: '#eee',
  },
  info: {
    padding: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  place: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
  },
});
