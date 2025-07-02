const express = require('express');
const router = express.Router();
const db = require('../models');
const fs = require('fs');
const path = require('path');
const LOG_DIR = path.join(__dirname, '..', 'logs');
const LOG_FILE = path.join(LOG_DIR, 'backend.log');
function logToFile(line) {
  const ts = new Date().toISOString();
  fs.appendFileSync(LOG_FILE, `[${ts}] ${line}\n`);
}

// GET /api/policies - list all policies
router.get('/', async (req, res) => {
  logToFile('[GET /api/policies] Endpoint hit');
  try {
    const policies = await db.Policy.findAll({
      include: [
        { model: db.MetadataAttribute, as: 'metadata' },
        { model: db.Attachment, as: 'attachments' },
        { model: db.PolicyVersion, as: 'versions' },
      ],
      order: [['updatedAt', 'DESC']],
    });
    logToFile(`[GET /api/policies] Returning ${policies.length} policies`);
    res.json(policies);
  } catch (err) {
    logToFile(`[GET /api/policies] ERROR: ${err}`);
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
    const policy = await db.Policy.create({ title, content, status, startDate, endDate, requiresApproval });

    if (changeNote && changeNote.trim() !== "") {
      // Create first version ONLY if changeNote is provided
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
    const policy = await db.Policy.findByPk(req.params.id);
    if (!policy) return res.status(404).json({ error: 'Not found' });
    await policy.update({ title, content, status, startDate, endDate, requiresApproval });
    
    if (changeNote && changeNote.trim() !== "") {
      // Create new version ONLY if changeNote is provided
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
