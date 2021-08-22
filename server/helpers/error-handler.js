function errorHandler(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: err });
  }
  if (erro.name === 'ValidationError') {
    return res.status(401).josn({ message: err });
  }
  return res.status(500).json({ message: err });            
}

module.exports = errorHandler;