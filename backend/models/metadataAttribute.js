module.exports = (sequelize, DataTypes) => {
  const MetadataAttribute = sequelize.define('MetadataAttribute', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    key: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.STRING, allowNull: false },
    dataType: { type: DataTypes.STRING, allowNull: false },
  });
  return MetadataAttribute;
};
