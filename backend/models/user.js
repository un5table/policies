module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    role: { type: DataTypes.ENUM('SuperAdmin', 'Admin', 'Editor'), defaultValue: 'Editor' },
    passwordHash: { type: DataTypes.STRING }, // For local dev only, SSO in prod
    suspended: { type: DataTypes.BOOLEAN, defaultValue: false },
  });
  return User;
};
