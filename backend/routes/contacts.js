const express = require('express');
const router = express.Router();
const db = require('../models');

// GET all contacts
router.get('/', async (req, res) => {
  const contacts = await db.Contact.findAll();
  res.json(contacts);
});

// POST create contact
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const contact = await db.Contact.create({ firstName, lastName, email });
    res.json(contact);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update contact
router.put('/:id', async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const contact = await db.Contact.findByPk(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Not found' });
    await contact.update({ firstName, lastName, email });
    res.json(contact);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE contact
router.delete('/:id', async (req, res) => {
  try {
    const contact = await db.Contact.findByPk(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Not found' });
    await contact.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
