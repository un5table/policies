module.exports = (sequelize, DataTypes) => {
  const PolicyMetadata = sequelize.define('PolicyMetadata', {
    policyId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    metadataAttributeId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true }
  }, {
    timestamps: true
  });
  return PolicyMetadata;
};
