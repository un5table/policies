module.exports = (sequelize, DataTypes) => {
  const PolicyVersion = sequelize.define('PolicyVersion', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    policyId: { type: DataTypes.INTEGER, allowNull: false },
    content: { type: DataTypes.TEXT('long'), allowNull: false },
    versionNumber: { type: DataTypes.INTEGER, allowNull: false },
    editorId: { type: DataTypes.INTEGER },
    editedDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    changeNote: { type: DataTypes.TEXT, allowNull: false }, // Required note for each change
  });
  return PolicyVersion;
};
