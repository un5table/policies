const express = require('express');
const router = express.Router();
const db = require('../models');

// GET all metadata attributes by type
router.get('/', async (req, res) => {
  const { type } = req.query;
  const where = type ? { dataType: type } : {};
  const attrs = await db.MetadataAttribute.findAll({ where });
  res.json(attrs);
});

// POST create attribute
router.post('/', async (req, res) => {
  try {
    const { key, value, dataType } = req.body;
    const attr = await db.MetadataAttribute.create({ key, value, dataType });
    res.json(attr);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update attribute
router.put('/:id', async (req, res) => {
  try {
    const { key, value, dataType } = req.body;
    const attr = await db.MetadataAttribute.findByPk(req.params.id);
    if (!attr) return res.status(404).json({ error: 'Not found' });
    await attr.update({ key, value, dataType });
    res.json(attr);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE attribute
router.delete('/:id', async (req, res) => {
  try {
    const attr = await db.MetadataAttribute.findByPk(req.params.id);
    if (!attr) return res.status(404).json({ error: 'Not found' });
    await attr.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
