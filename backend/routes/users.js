const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { Op } = require('sequelize');

// List all users (admin only)
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['passwordHash'] } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get current user (self)
router.get('/me', async (req, res) => {
  // TODO: Use real auth, for now use username from query or session
  const username = req.query.username;
  if (!username) return res.status(400).json({ error: 'Missing username' });
  const user = await User.findOne({ where: { username }, attributes: { exclude: ['passwordHash'] } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Create user (admin only)
router.post('/', async (req, res) => {
  try {
    const { username, email, role, password } = req.body;
    // TODO: hash password if present
    const user = await User.create({ username, email, role, passwordHash: password });
    res.status(201).json({ id: user.id });
  } catch (err) {
    res.status(400).json({ error: 'Failed to create user', detail: err.message });
  }
});

// Update user (admin or self)
router.put('/:id', async (req, res) => {
  try {
    const { email, role, password } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (email) user.email = email;
    if (role) user.role = role;
    if (password) user.passwordHash = password; // TODO: hash password
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update user', detail: err.message });
  }
});

// Suspend/lock user (admin only)
router.put('/:id/suspend', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.suspended = true;
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Failed to suspend user', detail: err.message });
  }
});

// Delete user (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete user', detail: err.message });
  }
});

module.exports = router;
