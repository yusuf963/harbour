const express = require('express');
const User = require('../models/user');
const router = express.Router();

// GET All Users
router.get('/', async (req, res) => {
  const usersList = await User.find();
  if (!usersList) {
    return res.status(404).send('No users found');
  }
  res.send(usersList);
});

//Create a new user
router.post('/', async (req, res) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    address: req.body.address,
    postcode: req.body.postcode,
    city: req.body.city,
  });
  try {
    user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).send({
      error: error,
      message: 'User not created',
    });
  }
});

module.exports = router;
