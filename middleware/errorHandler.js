module.exports = (err, req, res, next) => {
  console.error(err);
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message, errors: err.errors });
  }
  if (err.code && err.code === 11000) { // duplicate key
    return res.status(400).json({ message: 'Duplicate key error', detail: err.keyValue });
  }
  res.status(500).json({ message: 'Internal server error' });
};
