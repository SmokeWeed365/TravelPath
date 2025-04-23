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

// Multer config
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
router.get('/', listMemories);
router.get('/:id', getMemory);
router.post('/', upload.single('image'), createNewMemory);
router.put('/:id', upload.single('image'), updateExistingMemory);
router.delete('/:id', deleteExistingMemory);

module.exports = router;
