const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  address: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
  },
  postcode: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 255,
  },
  city: {
    type: String,
    required: true,
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
