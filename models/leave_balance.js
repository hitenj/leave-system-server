'use strict';
module.exports = (sequelize, DataTypes) => {
  const Leave_Balance = sequelize.define('Leave_Balance', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    balance: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'Leave_Balances',
    underscored: true,
    timestamps: false
  });

  Leave_Balance.associate = function(models) {
    Leave_Balance.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Leave_Balance;
};
