const express = require('express');
const router = express.Router();
const { PolicyVersion, Policy, User } = require('../models');
const { Op } = require('sequelize');

// List all versions for a policy
router.get('/policy/:policyId', async (req, res) => {
  try {
    const versions = await PolicyVersion.findAll({
      where: { policyId: req.params.policyId },
      order: [['versionNumber', 'DESC']],
      include: [
        { model: User, as: 'editor', attributes: ['id', 'username', 'email'] },
        { model: require('../models').Attachment, as: 'attachments', attributes: ['id', 'filename', 'filepath', 'mimetype', 'size'] }
      ]
    });
    res.json(versions);
  } catch (err) {
    console.error('Version history error:', err);
    res.status(500).json({ error: 'Failed to fetch versions', detail: err.message });
  }
});

// Get a single version
router.get('/:id', async (req, res) => {
  try {
    const version = await PolicyVersion.findByPk(req.params.id);
    if (!version) return res.status(404).json({ error: 'Not found' });
    res.json(version);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch version' });
  }
});

// Create a new version (on policy update)
router.post('/', async (req, res) => {
  try {
    const { policyId, content, editorId, changeNote } = req.body;
    if (!changeNote) return res.status(400).json({ error: 'Change note required' });
    // Find latest versionNumber
    const last = await PolicyVersion.findOne({
      where: { policyId },
      order: [['versionNumber', 'DESC']]
    });
    const versionNumber = last ? last.versionNumber + 1 : 1;
    const version = await PolicyVersion.create({
      policyId,
      content,
      editorId,
      changeNote,
      versionNumber
    });
    res.status(201).json(version);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create version', detail: err.message });
  }
});

// Revert to a previous version
router.post('/:id/revert', async (req, res) => {
  try {
    const version = await PolicyVersion.findByPk(req.params.id);
    if (!version) return res.status(404).json({ error: 'Version not found' });
    const policy = await Policy.findByPk(version.policyId);
    if (!policy) return res.status(404).json({ error: 'Policy not found' });
    // Create a new version with the reverted content
    const last = await PolicyVersion.findOne({
      where: { policyId: policy.id },
      order: [['versionNumber', 'DESC']]
    });
    const newVersionNumber = last ? last.versionNumber + 1 : 1;
    const { editorId, changeNote } = req.body;
    if (!changeNote) return res.status(400).json({ error: 'Change note required' });
    await PolicyVersion.create({
      policyId: policy.id,
      content: version.content,
      editorId,
      changeNote,
      versionNumber: newVersionNumber
    });
    // Update current policy content
    policy.content = version.content;
    await policy.save();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Failed to revert version', detail: err.message });
  }
});

module.exports = router;
