module.exports = (sequelize, DataTypes) => {
  const PolicyVersionAttachment = sequelize.define('PolicyVersionAttachment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    policyVersionId: { type: DataTypes.INTEGER, allowNull: false },
    attachmentId: { type: DataTypes.INTEGER, allowNull: false },
  });
  return PolicyVersionAttachment;
};
