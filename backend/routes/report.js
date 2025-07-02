const express = require('express');
const router = express.Router();
const { Policy, PolicyVersion, MetadataAttribute } = require('../models');
const { Op } = require('sequelize');
const PDFDocument = require('pdfkit');

// Helper: fetch policies and version history
async function fetchPoliciesWithVersions({ policyIds, metadata }) {
  let where = {};
  if (policyIds && policyIds.length) {
    where.id = { [Op.in]: policyIds };
  }
  // TODO: Add metadata filtering if needed
  const policies = await Policy.findAll({ where });
  const result = [];
  for (const policy of policies) {
    const versions = await PolicyVersion.findAll({
      where: { policyId: policy.id },
      order: [['versionNumber', 'ASC']]
    });
    result.push({ policy, versions });
  }
  return result;
}

// GET /api/report/history?policyIds=1,2,3
router.get('/history', async (req, res) => {
  try {
    const policyIds = req.query.policyIds ? req.query.policyIds.split(',').map(Number) : [];
    // TODO: support metadata filter
    const data = await fetchPoliciesWithVersions({ policyIds });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch report data' });
  }
});

// GET /api/report/history.pdf?policyIds=1,2,3
router.get('/history.pdf', async (req, res) => {
  try {
    const policyIds = req.query.policyIds ? req.query.policyIds.split(',').map(Number) : [];
    // TODO: support metadata filter
    const data = await fetchPoliciesWithVersions({ policyIds });
    const doc = new PDFDocument({ margin: 36, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="policy-history-report.pdf"');
    doc.pipe(res);
    doc.fontSize(20).fillColor('#008080').text('Policy Version History Report', { align: 'center' });
    doc.moveDown();
    for (const { policy, versions } of data) {
      doc.fontSize(16).fillColor('#333').text(`Policy: ${policy.title} (ID: ${policy.id})`);
      doc.fontSize(12).fillColor('#555').text(`Status: ${policy.status} | Start: ${policy.startDate} | End: ${policy.endDate}`);
      doc.moveDown(0.5);
      for (const v of versions) {
        doc.fontSize(11).fillColor('#111').text(`  Version ${v.versionNumber} | ${v.editedDate.toLocaleString()} | Editor: ${v.editorId}`);
        doc.fontSize(10).fillColor('#333').text(`    Note: ${v.changeNote}`);
        doc.moveDown(0.2);
      }
      doc.moveDown();
    }
    doc.end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate PDF report', detail: err.message });
  }
});

module.exports = router;
