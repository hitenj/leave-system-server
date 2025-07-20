const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware: Verify JWT and attach user to `req.user`
const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user; // Attach user to request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Role Middleware: Allow only Admin
const isAdmin = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  return res.status(403).json({ message: 'Access denied: Admins only' });
};

// Role Middleware: Allow only Manager
const isManager = (req, res, next) => {
  if (req.user?.role === 'manager') return next();
  return res.status(403).json({ message: 'Access denied: Managers only' });
};

// Role Middleware: Allow only Employee
const isEmployee = (req, res, next) => {
  if (req.user?.role === 'employee') return next();
  return res.status(403).json({ message: 'Access denied: Employees only' });
};

module.exports = {
  authenticateJWT,
  isAdmin,
  isManager,
  isEmployee,
};
