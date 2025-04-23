// backend/controllers/memoryController.js

const pool = require('../config/db');

// GET /api/memories?page=&limit=
async function listMemories(req, res) {
  try {
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const [rows] = await pool.query(
      'SELECT * FROM memories ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    res.json({ page, limit, data: rows });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
  }
}

// GET /api/memories/:id
async function getMemory(req, res) {
  try {
    const id      = req.params.id;
    const [rows]  = await pool.query(
      'SELECT * FROM memories WHERE id = ?',
      [id]
    );
    const memory = rows[0];
    if (!memory) return res.status(404).json({ error: 'Not found' });
    res.json(memory);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
  }
}

// POST /api/memories  (field ชื่อ 'image' สำหรับไฟล์)
async function createNewMemory(req, res) {
  try {
    const { title, place, description } = req.body;
    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    const [result] = await pool.query(
      'INSERT INTO memories (title, place, description, image_url) VALUES (?, ?, ?, ?)',
      [title, place, description, imageUrl]
    );

    res.status(201).json({
      id:          result.insertId,
      title,
      place,
      description,
      image_url:   imageUrl,
    });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
  }
}

// PUT /api/memories/:id  (field ชื่อ 'image')
async function updateExistingMemory(req, res) {
  try {
    const id           = req.params.id;
    const { title, place, description } = req.body;

    // สร้าง SQL ไดนามิก: update image_url เฉพาะเมื่อมีไฟล์ใหม่
    let sql    = 'UPDATE memories SET title = ?, place = ?, description = ?';
    const args = [title, place, description];

    if (req.file) {
      sql   += ', image_url = ?';
      args.push(`/uploads/${req.file.filename}`);
    }
    sql += ' WHERE id = ?';
    args.push(id);

    const [result] = await pool.query(sql, args);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Not found' });
    }

    // ส่งกลับ object ที่อัปเดต
    res.json({
      id,
      title,
      place,
      description,
      image_url: req.file
        ? `/uploads/${req.file.filename}`
        : undefined
    });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
  }
}

// DELETE /api/memories/:id
async function deleteExistingMemory(req, res) {
  try {
    const id           = req.params.id;
    const [result]     = await pool.query(
      'DELETE FROM memories WHERE id = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  listMemories,
  getMemory,
  createNewMemory,
  updateExistingMemory,
  deleteExistingMemory,
};
