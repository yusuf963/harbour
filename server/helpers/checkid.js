const mongoose = require('mongoose');

// mongoose id validation, custom function, Get id from url mongoose id validation
const idValidation = (req, res) => {
  const idValidation = mongoose.isValidObjectId(req.params.id);
  if (!idValidation) {
    return res.status(400).send('Invalid id');
  }
};

module.exports = idValidation;
