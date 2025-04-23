// app.js
require('dotenv').config();              // โหลดตัวแปรจาก .env
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app = express();

// --- Middleware พื้นฐาน ---
app.use(cors());                         // เปิด CORS ให้เรียกจาก frontend ได้
app.use(express.json());                 // แปลง JSON body ให้เป็น object

// --- เสิร์ฟรูปจากโฟลเดอร์ uploads ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Mount memory routes ---
const memoryRoutes = require('./routes/memoryRoutes');
app.use('/api/memories', memoryRoutes);

// --- เริ่มต้นเซิร์ฟเวอร์ ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
