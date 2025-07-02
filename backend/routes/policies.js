const express = require('express');
const router = express.Router();
const db = require('../models');

// GET /api/policies - list all policies
router.get('/', async (req, res) => {
  try {
    const policies = await db.Policy.findAll({
      include: [
        { model: db.MetadataAttribute, as: 'metadata' },
        { model: db.Attachment, as: 'attachments' },
        { model: db.PolicyVersion, as: 'versions' },
      ],
      order: [['updatedAt', 'DESC']],
    });
    res.json(policies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/policies/:id - get policy by id
router.get('/:id', async (req, res) => {
  try {
    const policy = await db.Policy.findByPk(req.params.id, {
      include: [
        { model: db.MetadataAttribute, as: 'metadata' },
        { model: db.Attachment, as: 'attachments' },
        { model: db.PolicyVersion, as: 'versions' },
      ],
    });
    if (!policy) return res.status(404).json({ error: 'Not found' });
    res.json(policy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/policies - create new policy
router.post('/', async (req, res) => {
  try {
    const { title, content, status, startDate, endDate, requiresApproval, metadata, attachments, changeNote, editorId } = req.body;
    if (!changeNote) return res.status(400).json({ error: 'Change note required' });
    const policy = await db.Policy.create({ title, content, status, startDate, endDate, requiresApproval });
    // Add metadata
    if (Array.isArray(metadata)) {
      for (const meta of metadata) {
        let [attr] = await db.MetadataAttribute.findOrCreate({ where: { key: meta.key, value: meta.value }, defaults: { dataType: 'string' } });
        await policy.addMetadata(attr);
      }
    }
    // Create first version
    const version = await db.PolicyVersion.create({
      policyId: policy.id,
      content,
      editorId: editorId || null,
      changeNote,
      versionNumber: 1
    });
    // Snapshot attachments for this version
    let attachmentIds = [];
    if (Array.isArray(attachments) && attachments.length > 0) {
      attachmentIds = attachments.map(a => a.id || a);
    } else {
      // fallback: get all attachments for this policy
      const currentAttachments = await policy.getAttachments();
      attachmentIds = currentAttachments.map(a => a.id);
    }
    if (attachmentIds.length > 0) {
      await version.setAttachments(attachmentIds);
    }
    res.status(201).json(policy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/policies/:id - update policy
router.put('/:id', async (req, res) => {
  try {
    const { title, content, status, startDate, endDate, requiresApproval, metadata, changeNote, editorId } = req.body;
    if (!changeNote) return res.status(400).json({ error: 'Change note required' });
    const policy = await db.Policy.findByPk(req.params.id);
    if (!policy) return res.status(404).json({ error: 'Not found' });
    await policy.update({ title, content, status, startDate, endDate, requiresApproval });
    // Update metadata
    if (Array.isArray(metadata)) {
      await policy.setMetadata([]);
      for (const meta of metadata) {
        let [attr] = await db.MetadataAttribute.findOrCreate({ where: { key: meta.key, value: meta.value }, defaults: { dataType: 'string' } });
        await policy.addMetadata(attr);
      }
    }
    // Create new version
    const last = await db.PolicyVersion.findOne({ where: { policyId: policy.id }, order: [['versionNumber', 'DESC']] });
    const versionNumber = last ? last.versionNumber + 1 : 1;
    const version = await db.PolicyVersion.create({
      policyId: policy.id,
      content,
      editorId: editorId || null,
      changeNote,
      versionNumber
    });
    // Snapshot attachments for this version
    const currentAttachments = await policy.getAttachments();
    const attachmentIds = currentAttachments.map(a => a.id);
    if (attachmentIds.length > 0) {
      await version.setAttachments(attachmentIds);
    }
    res.json(policy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/policies/:id - delete policy
router.delete('/:id', async (req, res) => {
  try {
    const policy = await db.Policy.findByPk(req.params.id);
    if (!policy) return res.status(404).json({ error: 'Not found' });
    await policy.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
