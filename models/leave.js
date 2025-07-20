'use strict';
module.exports = (sequelize, DataTypes) => {
  const Leave = sequelize.define('Leave', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    from_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    to_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
    manager_comment: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'Leaves',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  Leave.associate = function(models) {
    Leave.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Leave;
};
