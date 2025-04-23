// frontend/screens/AddCardScreen.js
import React, { useState, useEffect } from 'react';
import { SafeAreaView }           from 'react-native-safe-area-context';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  Platform
} from 'react-native';
import { useIsFocused }           from '@react-navigation/native';
import * as ImagePicker           from 'expo-image-picker';
import Constants                  from 'expo-constants';
import Header                     from '../components/Header';
import api                        from '../api';

export default function AddCardScreen({ navigation, route }) {
  const isFocused = useIsFocused();
  const params    = route.params || {};
  const isEdit    = !!params.id;

  const [title, setTitle]       = useState('');
  const [place, setPlace]       = useState('');
  const [description, setDesc]  = useState('');
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    if (isFocused) {
      if (isEdit) {
        setTitle(params.title);
        setPlace(params.place);
        setDesc(params.description);
        setImageUri(
          params.image_url
            ? `http://${getHost()}:3000${params.image_url}`
            : null
        );
      } else {
        setTitle('');
        setPlace('');
        setDesc('');
        setImageUri(null);
        navigation.setParams({});
      }
    }
  }, [isFocused]);

  function getHost() {
    const manifest     = Constants.manifest || Constants.manifest2 || {};
    const debuggerHost = manifest.debuggerHost || manifest.hostUri || 'localhost:19000';
    let host           = debuggerHost.split(':')[0];
    if (Platform.OS === 'android' && host === 'localhost') {
      host = '10.0.2.2';
    }
    return host;
  }

  async function pickImage() {
    console.log('🔍 pickImage called');
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log('📱 permission status:', status);
    if (status !== 'granted') {
      return Alert.alert('ต้องการสิทธิ์เข้าถึงรูปภาพ');
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.7,
      });
      console.log('🖼 picker result:', result);
      if (!result.canceled && result.assets?.length > 0) {
        setImageUri(result.assets[0].uri);
        console.log('✅ setImageUri:', result.assets[0].uri);
      } else {
        console.log('✖️ user canceled or no assets');
      }
    } catch (e) {
      console.error('❌ launchImageLibraryAsync error:', e);
    }
  }

  async function submit() {
    if (!title.trim() || !place.trim()) {
      return Alert.alert('กรุณากรอก Title และ Place ให้ครบ');
    }
    const form = new FormData();
    form.append('title', title);
    form.append('place', place);
    form.append('description', description);
    if (imageUri && imageUri.startsWith('file://')) {
      const name = imageUri.split('/').pop();
      form.append('image', { uri: imageUri, name, type: 'image/jpeg' });
    }
    try {
      if (isEdit) {
        await api.put(
          `/memories/${params.id}`,
          form,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      } else {
        await api.post(
          '/memories',
          form,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      }
      // เคลียร์ params แล้วกลับไป Home (รีเซ็ต form ครั้งถัดไป)
      navigation.setParams({});
      navigation.navigate('Home');
    } catch (err) {
      console.error('Upload error:', err);
      Alert.alert('ไม่สามารถบันทึกได้');
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title={isEdit ? 'Edit Memory' : 'Add Memory'}
        onBack={() => navigation.navigate('Home')}
      />

      <TouchableOpacity
        style={styles.imagePicker}
        onPress={pickImage}
        activeOpacity={0.7}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.preview} />
        ) : (
          <Text style={styles.imagePickerText}>Add Image</Text>
        )}
      </TouchableOpacity>

      <TextInput
        placeholder="TripName"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Place"
        value={place}
        onChangeText={setPlace}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDesc}
        multiline
        style={[styles.input, styles.textArea]}
      />

      <TouchableOpacity style={styles.submitBtn} onPress={submit}>
        <Text style={styles.submitBtnText}>
          {isEdit ? 'Save Changes' : 'Add Journal!'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea:        { flex: 1, backgroundColor: '#FFF' },
  imagePicker:     {
    margin: 16,
    height: 150,
    borderRadius: 100,
    backgroundColor: '#EEEDED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerText: { fontSize: 18, color: '#757575' },
  preview:         { width: 150, height: 150, borderRadius: 100 },
  input:           {
    backgroundColor: '#EEEDED',
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  textArea:        { height: 100 },
  submitBtn:       {
    backgroundColor: '#757575',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitBtnText:   { color: '#FFF', fontSize: 16 },
});
