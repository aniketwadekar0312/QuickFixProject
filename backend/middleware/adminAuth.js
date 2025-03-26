const isAdmin = (req, res, next) => {
  // Check if user is admin

  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied. Admin only.' });
  }
  next();
};

module.exports = { isAdmin };