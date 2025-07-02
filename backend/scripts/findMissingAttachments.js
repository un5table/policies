const fs = require('fs');
const path = require('path');
const db = require('../models');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

async function main() {
  await db.sequelize.sync();
  const attachments = await db.Attachment.findAll();
  let missing = [];
  for (const att of attachments) {
    const filePath = path.join(UPLOAD_DIR, att.filename);
    if (!fs.existsSync(filePath)) {
      missing.push({ id: att.id, filename: att.filename, policyId: att.policyId });
    }
  }
  if (missing.length === 0) {
    console.log('All attachment files are present.');
  } else {
    console.log('Missing attachment files:');
    missing.forEach(att => console.log(`ID: ${att.id}, Policy: ${att.policyId}, File: ${att.filename}`));
  }
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
