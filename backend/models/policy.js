module.exports = (sequelize, DataTypes) => {
  const Policy = sequelize.define('Policy', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT('long'), allowNull: false },
    status: { type: DataTypes.ENUM('Draft', 'Published', 'Archived'), defaultValue: 'Draft' },
    startDate: { type: DataTypes.DATE, allowNull: false },
    endDate: { type: DataTypes.DATE, allowNull: false },
    requiresApproval: { type: DataTypes.BOOLEAN, defaultValue: false },
    createdById: { type: DataTypes.INTEGER },
  });
  return Policy;
};
