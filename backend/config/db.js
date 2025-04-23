// config/db.js
require('dotenv').config();               // โหลดตัวแปรจาก .env
const mysql = require('mysql2/promise');  // ใช้ mysql2 แบบ promise เพื่อเรียก async/await ได้

// สร้าง connection pool สำหรับจัดการการเชื่อมต่อ
const pool = mysql.createPool({
  host:     process.env.DB_HOST,         // จาก .env
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,              // รอให้มี connection ว่างก่อน
  connectionLimit: 10,                   // จำนวน connection สูงสุดใน pool
  queueLimit: 0                          // ไม่มี limit ในการรอคิว
});

// ส่งออก pool เพื่อให้ไฟล์อื่นนำไปใช้
module.exports = pool;
