// components/PlaceholderCard.js
import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

/**
 * props:
 * - style: ปรับ style ของ container ได้
 * - showTitle: แสดงแถบ placeholder ของ title หรือไม่
 * - showPlace: แสดงแถบ placeholder ของ place หรือไม่
 * - onPress: ถ้าใส่ จะเป็น TouchableOpacity
 */
export default function PlaceholderCard({
  style = {},
  showTitle = true,
  showPlace = true,
  onPress,
}) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.imagePlaceholder, style.imagePlaceholder]} />
      <View style={styles.info}>
        {showTitle && (
          <View
            style={[styles.titlePlaceholder, style.titlePlaceholder]}
          />
        )}
        {showPlace && (
          <View
            style={[styles.placePlaceholder, style.placePlaceholder]}
          />
        )}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    margin: 8,
    borderRadius: 8,
    backgroundColor: '#EEEDED',
    overflow: 'hidden',
  },
  imagePlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: '#DDD',
  },
  info: {
    padding: 8,
  },
  titlePlaceholder: {
    width: '70%',
    height: 16,
    backgroundColor: '#DDD',
    marginBottom: 8,
    borderRadius: 4,
  },
  placePlaceholder: {
    width: '40%',
    height: 14,
    backgroundColor: '#DDD',
    borderRadius: 4,
  },
});
