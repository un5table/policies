module.exports = (sequelize, DataTypes) => {
  const Attachment = sequelize.define('Attachment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    policyId: { type: DataTypes.INTEGER, allowNull: true },
    filename: { type: DataTypes.STRING, allowNull: false },
    originalName: { type: DataTypes.STRING, allowNull: true }, // Store original uploaded filename
    filepath: { type: DataTypes.STRING, allowNull: true },
    mimetype: { type: DataTypes.STRING, allowNull: false },
    size: { type: DataTypes.INTEGER },
  });
  return Attachment;
};
