const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../models');

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + '-' + file.originalname);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// POST /api/attachments/upload - upload file
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { policyId } = req.body;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    // Save attachment metadata
    const attachment = await db.Attachment.create({
      filename: req.file.filename,
      filepath: `uploads/${req.file.filename}`,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      policyId: policyId || null,
    });
    res.json({ attachment });
  } catch (err) {
    console.error('Attachment upload error:', err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// GET /api/attachments/:id/download - download file by attachment id
router.get('/:id/download', async (req, res) => {
  try {
    const attachment = await db.Attachment.findByPk(req.params.id);
    if (!attachment) return res.status(404).json({ error: 'Not found' });
    const filepath = path.join(UPLOAD_DIR, attachment.filename);
    if (!fs.existsSync(filepath)) {
      console.error(`[Attachment Download] File not found: ${filepath} for attachment ID ${attachment.id}`);
      return res.status(404).json({ error: 'File not found. This attachment is no longer available on the server.' });
    }
    res.download(filepath, attachment.originalName || attachment.filename);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/attachments/:id/metadata - get attachment metadata
router.get('/:id/metadata', async (req, res) => {
  try {
    const attachment = await db.Attachment.findByPk(req.params.id);
    if (!attachment) return res.status(404).json({ error: 'Not found' });
    res.json(attachment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
