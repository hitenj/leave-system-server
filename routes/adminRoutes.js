const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateJWT, isAdmin } = require('../middlewares/auth'); // ✅ fixed import

// Only accessible by admin
router.post('/reset-balances', authenticateJWT, isAdmin, adminController.resetYearlyBalances);

// View all leave balances
router.get('/leave-balances', authenticateJWT, isAdmin, adminController.getAllLeaveBalances);

// Update leave balance
router.put('/leave-balances', authenticateJWT, isAdmin, adminController.updateLeaveBalance);

// View audit logs
router.get('/audit-logs', authenticateJWT, isAdmin, adminController.getAuditLogs);

module.exports = router;
