// screens/AddCardScreen.js
import React, { useState, useEffect } from 'react';
import { SafeAreaView }           from 'react-native-safe-area-context';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet
} from 'react-native';
import { useIsFocused }           from '@react-navigation/native';
import * as ImagePicker           from 'expo-image-picker';
import Header                     from '../components/Header';
import api                        from '../api';

export default function AddCardScreen({ navigation, route }) {
  const isFocused = useIsFocused();
  const params    = route.params || {};
  const isEdit    = !!params.id;

  // form state
  const [title, setTitle]     = useState('');
  const [place, setPlace]     = useState('');
  const [description, setDesc]= useState('');
  const [imageUri, setImageUri]= useState(null);

  // reset or prefill on focus
  useEffect(() => {
    if (isFocused) {
      if (isEdit) {
        setTitle(params.title);
        setPlace(params.place);
        setDesc(params.description);
        setImageUri(
          params.image_url
            ? `http://localhost:3000${params.image_url}`
            : null
        );
      } else {
        // สร้างใหม่ → เคลียร์ form + params
        setTitle('');
        setPlace('');
        setDesc('');
        setImageUri(null);
        navigation.setParams({}); 
      }
    }
  }, [isFocused]);

  // pick image
  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return Alert.alert('ต้องการสิทธิ์เข้าถึงรูปภาพ');
    }
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  }

  // submit form
  async function submit() {
    if (!title.trim() || !place.trim()) {
      return Alert.alert('กรุณากรอก Title และ Place ให้ครบ');
    }
    const form = new FormData();
    form.append('title', title);
    form.append('place', place);
    form.append('description', description);

    // แนบไฟล์ใหม่ถ้ามี
    if (imageUri && imageUri.startsWith('file://')) {
      const name = imageUri.split('/').pop();
      form.append('image', { uri:imageUri, name, type:'image/jpeg' });
    }
    // ถ้า edit แต่ไม่ได้เลือกรูปใหม่ → ไม่ต้องแนบอะไรเพิ่ม

    try {
      if (isEdit) {
        await api.put(`/memories/${params.id}`, form, {
          headers:{ 'Content-Type':'multipart/form-data' }
        });
      } else {
        await api.post('/memories', form, {
          headers:{ 'Content-Type':'multipart/form-data' }
        });
      }
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('เกิดข้อผิดพลาด ไม่สามารถบันทึกได้');
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title={isEdit ? 'Edit Memory' : 'Add Memory'}
        onBack={() => navigation.goBack()}
      />

      {/* Add Image Placeholder */}
      <TouchableOpacity
        style={styles.imagePicker}
        onPress={pickImage}
        activeOpacity={0.7}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.preview}/>
        ) : (
          <Text style={styles.imagePickerText}>Add Image</Text>
        )}
      </TouchableOpacity>

      {/* Form Inputs */}
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

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitBtn} onPress={submit}>
        <Text style={styles.submitBtnText}>
          {isEdit ? 'Save Changes' : 'Add Journal!'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea:        { flex:1, backgroundColor:'#FFF' },
  imagePicker:     {
    margin:16,
    height:150,
    borderRadius:100,
    backgroundColor:'#EEEDED',
    justifyContent:'center',
    alignItems:'center'
  },
  imagePickerText: { fontSize:18, color:'#757575' },
  preview:         {
    width:150,
    height:150,
    borderRadius:100
  },
  input:           {
    backgroundColor:'#EEEDED',
    marginHorizontal:16,
    padding:12,
    borderRadius:8,
    marginBottom:12
  },
  textArea:        { height:100 },
  submitBtn:       {
    backgroundColor:'#757575',
    margin:16,
    padding:16,
    borderRadius:8,
    alignItems:'center'
  },
  submitBtnText:   { color:'#FFF', fontSize:16 }
});
