// frontend/api/index.js
import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// อ่าน host จาก Expo bundler (debuggerHost) หรือ fallback เป็น localhost:19000
const manifest     = Constants.manifest || Constants.manifest2 || {};
const debuggerHost = manifest.debuggerHost || manifest.hostUri || 'localhost:19000';
let host           = debuggerHost.split(':')[0];

// บน Android emulator ให้เปลี่ยน localhost → 10.0.2.2
if (Platform.OS === 'android' && host === 'localhost') {
  host = '10.0.2.2';
}

// สร้าง axios instance ให้เรียก API ถูกต้อง
const api = axios.create({
  baseURL: `http://${host}:3000/api`,
  timeout: 5000,
});

export default api;
