const db = require('../models');

async function backfill() {
  await db.sequelize.sync();
  const policies = await db.Policy.findAll();
  let created = 0;
  for (const policy of policies) {
    const count = await db.PolicyVersion.count({ where: { policyId: policy.id } });
    if (count === 0) {
      await db.PolicyVersion.create({
        policyId: policy.id,
        content: policy.content,
        editorId: policy.createdById || null,
        changeNote: 'Initial version (backfilled)',
        versionNumber: 1
      });
      created++;
    }
  }
  console.log(`Backfilled ${created} policies with initial PolicyVersion.`);
  process.exit(0);
}

backfill().catch(e => { console.error(e); process.exit(1); });
