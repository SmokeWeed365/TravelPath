// models/memoryModel.js
const pool = require('../config/db');

const DEFAULT_LIMIT = 10;

// ดึงรายการความทรงจำทั้งหมด (pagination)
async function getMemories(page = 1, limit = DEFAULT_LIMIT) {
  const offset = (page - 1) * limit;
  const [rows] = await pool.query(
    'SELECT * FROM memories ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [limit, offset]
  );
  return rows;
}

// ดึงความทรงจำตาม id
async function getMemoryById(id) {
  const [rows] = await pool.query(
    'SELECT * FROM memories WHERE id = ?',
    [id]
  );
  return rows[0];
}

// สร้างความทรงจำใหม่
async function createMemory({ title, place, description, imageUrl }) {
  const [result] = await pool.query(
    'INSERT INTO memories (title, place, description, image_url) VALUES (?, ?, ?, ?)',
    [title, place, description, imageUrl]
  );
  return result.insertId;  // คืน id ของแถวที่สร้างใหม่
}

// แก้ไขความทรงจำ
async function updateMemory(id, { title, place, description, imageUrl }) {
  const [result] = await pool.query(
    `UPDATE memories
     SET title = ?, place = ?, description = ?, image_url = ?
     WHERE id = ?`,
    [title, place, description, imageUrl, id]
  );
  return result.affectedRows;  // จำนวนแถวที่ถูกอัปเดต
}

// ลบความทรงจำ
async function deleteMemory(id) {
  const [result] = await pool.query(
    'DELETE FROM memories WHERE id = ?',
    [id]
  );
  return result.affectedRows;  // จำนวนแถวที่ถูกลบ
}

module.exports = {
  getMemories,
  getMemoryById,
  createMemory,
  updateMemory,
  deleteMemory,
};
