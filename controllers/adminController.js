const { User, Leave_Balance, Audit_Log } = require('../models');

exports.resetYearlyBalances = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const defaultBalances = {
      casual: 12,
      sick: 8
    };

    const allUsers = await Leave_Balance.sequelize.query(
      `SELECT DISTINCT user_id FROM Leave_Balances`,
      { type: Leave_Balance.sequelize.QueryTypes.SELECT }
    );

    for (const user of allUsers) {
      for (const type in defaultBalances) {
        await Leave_Balance.upsert({
          user_id: user.user_id,
          type,
          year: currentYear,
          balance: defaultBalances[type]
        });
      }
    }

    await Audit_Log.create({
      action_by: req.user.id,
      action_type: 'yearly_balance_reset',
      action_target: `All Users - ${currentYear}`
    });

    res.json({ message: 'Leave balances reset for the new year.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to reset balances.' });
  }
};

exports.getAllLeaveBalances = async (req, res) => {
  try {
    const balances = await Leave_Balance.findAll({
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });

    res.json(balances);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch leave balances.' });
  }
};

exports.updateLeaveBalance = async (req, res) => {
  const { user_id, type, year, balance } = req.body;

  try {
    const leaveBalance = await Leave_Balance.findOne({
      where: { user_id, type, year }
    });

    if (!leaveBalance) {
      return res.status(404).json({ message: 'Leave balance not found.' });
    }

    leaveBalance.balance = balance;
    await leaveBalance.save();

    await Audit_Log.create({
      action_by: req.user.id,
      action_type: 'leave_balance_updated',
      action_target: `User ${user_id} - ${type} (${year})`
    });

    res.json({ message: 'Leave balance updated.', leaveBalance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update balance.' });
  }
};

exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await Audit_Log.findAll({
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
      order: [['timestamp', 'DESC']]
    });

    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch audit logs.' });
  }
};