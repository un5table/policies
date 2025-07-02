const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './policies.sqlite',
  logging: false,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Policy = require('./policy')(sequelize, Sequelize);
db.PolicyVersion = require('./policyVersion')(sequelize, Sequelize);
db.MetadataAttribute = require('./metadataAttribute')(sequelize, Sequelize);
db.Contact = require('./contact')(sequelize, Sequelize);
db.Attachment = require('./attachment')(sequelize, Sequelize);
db.User = require('./user')(sequelize, Sequelize);
db.PolicyVersionAttachment = require('./policyVersionAttachment')(sequelize, Sequelize);

// Associations
// Policy has many versions
// Policy has many attachments
// Policy has many metadata attributes (through PolicyMetadata)
db.Policy.hasMany(db.PolicyVersion, { foreignKey: 'policyId', as: 'versions' });
db.Policy.hasMany(db.Attachment, { foreignKey: 'policyId', as: 'attachments' });
db.Policy.belongsToMany(db.MetadataAttribute, { through: 'PolicyMetadata', as: 'metadata', foreignKey: 'policyId' });
db.MetadataAttribute.belongsToMany(db.Policy, { through: 'PolicyMetadata', as: 'policies', foreignKey: 'metadataAttributeId' });

db.Policy.belongsTo(db.User, { as: 'createdBy', foreignKey: 'createdById' });
db.PolicyVersion.belongsTo(db.User, { as: 'editor', foreignKey: 'editorId' });

// PolicyVersion <-> Attachment snapshot association
// A PolicyVersion can have many Attachments (snapshot)
db.PolicyVersion.belongsToMany(db.Attachment, {
  through: db.PolicyVersionAttachment,
  as: 'attachments',
  foreignKey: 'policyVersionId',
  otherKey: 'attachmentId'
});
db.Attachment.belongsToMany(db.PolicyVersion, {
  through: db.PolicyVersionAttachment,
  as: 'policyVersions',
  foreignKey: 'attachmentId',
  otherKey: 'policyVersionId'
});

module.exports = db;
