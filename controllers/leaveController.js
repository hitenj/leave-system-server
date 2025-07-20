const { Leave, Leave_Balance, Audit_Log, User } = require("../models");
const { Op } = require("sequelize");

// Apply for Leave (with overlap check + audit)
exports.createLeaveRequest = async (req, res) => {
  const userId = req.user.id;
  const { from_date, to_date, type, reason } = req.body;

  try {
    const overlapping = await Leave.findOne({
      where: {
        user_id: userId,
        status: { [Op.in]: ["pending", "approved"] },
        [Op.or]: [
          {
            from_date: { [Op.between]: [from_date, to_date] },
          },
          {
            to_date: { [Op.between]: [from_date, to_date] },
          },
          {
            [Op.and]: [
              { from_date: { [Op.lte]: from_date } },
              { to_date: { [Op.gte]: to_date } },
            ],
          },
        ],
      },
    });

    if (overlapping) {
      return res
        .status(400)
        .json({ message: "Overlapping leave already exists" });
    }

    const leave = await Leave.create({
      user_id: userId,
      from_date,
      to_date,
      reason,
      type,
      status: "pending",
    });

    await Audit_Log.create({
      action_by: userId,
      action_type: "leave_applied",
      action_target: `Leave ID: ${leave.id}`,
    });

    res.status(201).json(leave);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create leave request" });
  }
};

// Get your own leaves
exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.findAll({ where: { user_id: req.user.id } });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your leaves" });
  }
};

// Get all leaves (for admin/manager)
exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.findAll({
      include: [{ model: User, attributes: ["name", "email"] }],
    });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all leaves" });
  }
};

// Approve leave with balance deduction + audit
exports.approveLeave = async (req, res) => {
  const managerId = req.user.id;
  const leave = await Leave.findByPk(req.params.id);

  if (!leave) return res.status(404).json({ message: "Leave not found" });

  try {
    const days =
      (new Date(leave.to_date) - new Date(leave.from_date)) /
        (1000 * 60 * 60 * 24) +
      1;

    const userId = leave.user_id;

    console.log("DEBUG → approving leave for:", {
      user_id: userId,
      type: leave.type,
      year: new Date().getFullYear(),
    });

    const balance = await Leave_Balance.findOne({
      where: {
        user_id: userId,
        type: leave.type,
        year: new Date().getFullYear(),
      },
    });

    if (!balance) {
      // Auto-create leave balance if not found
      await Leave_Balance.create({
        user_id: userId,
        type: leave.type,
        balance: 10, // default balance, adjust as needed
        year: new Date().getFullYear(),
      });

      return res
        .status(400)
        .json({ message: "Leave balance created. Retry approval." });
    }

    if (balance.balance < days) {
      return res.status(400).json({ message: "Insufficient leave balance" });
    }

    // Deduct balance
    balance.balance -= days;
    await balance.save();

    // Approve leave
    leave.status = "approved"; // match ENUM lowercase
    leave.manager_comment = req.body.manager_comment || null;
    await leave.save();

    await Audit_Log.create({
      action_by: managerId,
      action_type: "leave_approved",
      action_target: `Leave ID: ${leave.id}`,
    });

    res.json(leave);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to approve leave" });
  }
};

// Reject leave with audit
exports.rejectLeave = async (req, res) => {
  const managerId = req.user.id;
  const leave = await Leave.findByPk(req.params.id);

  if (!leave) return res.status(404).json({ message: "Leave not found" });

  try {
    leave.status = "rejected";
    leave.manager_comment = req.body.manager_comment || null;
    await leave.save();

    await Audit_Log.create({
      action_by: managerId,
      action_type: "leave_rejected",
      action_target: `Leave ID: ${leave.id}`,
    });

    res.json(leave);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to reject leave" });
  }
};

exports.cancelLeave = async (req, res) => {
  const userId = req.user.id;
  const leaveId = req.params.id;

  try {
    const leave = await Leave.findOne({
      where: { id: leaveId, user_id: userId },
    });

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    if (leave.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending leaves can be cancelled" });
    }

    await leave.destroy();

    await Audit_Log.create({
      action_by: userId,
      action_type: "leave_cancelled",
      action_target: `Leave ID: ${leaveId}`,
    });

    res.json({ message: "Leave cancelled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to cancel leave" });
  }
};

// Get logged-in user's leave balances
exports.getMyLeaveBalances = async (req, res) => {
  const userId = req.user.id;
  const year = new Date().getFullYear();

  try {
    const balances = await Leave_Balance.findAll({
      where: {
        user_id: userId,
        year
      }
    });

    res.json(balances);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch leave balances' });
  }
};
