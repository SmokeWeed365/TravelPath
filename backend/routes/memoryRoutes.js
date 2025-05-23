const express = require('express');
const multer  = require('multer');
const path    = require('path');
const {
  listMemories,
  getMemory,
  createNewMemory,
  updateExistingMemory,
  deleteExistingMemory,
} = require('../controllers/memoryController');

const router = express.Router();

// ตั้งค่า multer เก็บไฟล์ในโฟลเดอร์ uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage });

// CRUD routes
router.get('/',    listMemories);
router.get('/:id', getMemory);

// POST + PUT จะใช้ field ชื่อ 'image' รับไฟล์จาก client
router.post('/',           upload.single('image'), createNewMemory);
router.put('/:id',         upload.single('image'), updateExistingMemory);

router.delete('/:id',      deleteExistingMemory);

module.exports = router;
