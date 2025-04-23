// api/index.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.41:3000/api', // ถ้าเรียกจากมือถือจริง ให้เปลี่ยน localhost เป็น IP ของเครื่องพัฒนา
  timeout: 5000,                       // รอได้ไม่เกิน 5 วินาที
});

export default api;
