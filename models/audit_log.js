'use strict';
module.exports = (sequelize, DataTypes) => {
  const Audit_Log = sequelize.define('Audit_Log', {
    action_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    action_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    action_target: {
      type: DataTypes.STRING,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'Audit_Logs',
    underscored: true,
    timestamps: false
  });

  Audit_Log.associate = function(models) {
    Audit_Log.belongsTo(models.User, { foreignKey: 'action_by' });
  };

  return Audit_Log;
};
