const express = require('express');
const router = express.Router();
const {
  createLeaveRequest,
  getMyLeaves,
  getAllLeaves,
  cancelLeave,
  approveLeave,
  rejectLeave // ✅ Make sure this is included
} = require('../controllers/leaveController');

const { getMyLeaveBalances } = require('../controllers/leaveController');


const { updateLeaveBalance, resetYearlyBalances, getAllLeaveBalances } = require('../controllers/adminController');

const { authenticateJWT, isAdmin, isManager } = require('../middlewares/auth');

// Custom middleware for manager or admin
const isManagerOrAdmin = (req, res, next) => {
  if (req.user?.role === 'manager' || req.user?.role === 'admin') return next();
  return res.status(403).json({ message: 'Access denied: Managers or Admins only' });
};

// Routes
router.post('/', authenticateJWT, createLeaveRequest); // Employee creates leave
router.get('/me', authenticateJWT, getMyLeaves);       // Get own leave requests
router.get('/', authenticateJWT, isManagerOrAdmin, getAllLeaves); // Managers/Admins see all
router.put('/:id/update-leave-balance', authenticateJWT, isManager, updateLeaveBalance); // Manager updates status
router.delete('/:id/cancel', authenticateJWT, cancelLeave); // ✅ Fixed this line
router.patch('/:id/approve', authenticateJWT, isManager, approveLeave);
router.patch('/:id/reject', authenticateJWT, isManager, rejectLeave);
router.get('/my-balances', authenticateJWT, getMyLeaveBalances);


module.exports = router;
