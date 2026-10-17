
const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role)) {
    res.status(403);
    return next(new Error(`Access denied for role: ${req.user.role}`));
  }
  next();
};

module.exports = { authorizeRoles };
