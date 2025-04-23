// frontend/components/MemoryCard.js
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform
} from 'react-native';
import Constants from 'expo-constants';

export default function MemoryCard({ memory, onPress }) {
  const manifest   = Constants.manifest || Constants.manifest2 || {};
  const hostUri    = manifest.debuggerHost || manifest.hostUri || 'localhost:19000';
  let host         = hostUri.split(':')[0];
  if (Platform.OS === 'android' && host === 'localhost') {
    host = '10.0.2.2';
  }

  const imageSource = memory.image_url
    ? { uri: `http://${host}:3000${memory.image_url}` }
    : null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {imageSource ? (
        <Image
          source={imageSource}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.imagePlaceholder} />
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
    flex: 1,
    margin: 8,
    borderRadius: 8,
    backgroundColor: '#EEEDED',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 100,
    backgroundColor: '#DDD',
  },
  // กล่อง placeholder สีเทา
  imagePlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: '#DDD',
  },
  info: {
    padding: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  place: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
});
