const express = require('express');
const User = require('../models/user');
const router = express.Router();

// GET All Users
router.get('/', async (req, res) => {
  const usersList = await User.find().select('-password').exec();
  if (!usersList) {
    return res.status(404).send('No users found');
  }
  res.send(usersList);
});

//get one user
router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    return res.status(404).send('User not found');
  }
  res.send(user);
});

//deletes a user
router.delete('/:id', (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        res.status(200).json({ sucess: true, message: 'User deleted' });
      } else {
        return res
          .status(404)
          .json({ sucess: false, message: 'User not found' });
      }
    })
    .catch((err) => {
      return res.status(404).json({ err: err, message: 'User not found' });
    });
});

//Create a new user
router.post('/', async (req, res) => {
  //check if the user already exists
  const checkingUser = await User.findOne({ email: req.body.email });
  if (checkingUser) {
    return res.status(400).send('User already exists');
  }
  //create a new user
  let user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    address: req.body.address,
    postcode: req.body.postcode,
    city: req.body.city,
  });
  //save the user in the database
  try {
    user = await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send({
      error: error,
      message: 'User not created',
    });
  }
});

//update a user
router.put('/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      address: req.body.address,
      postcode: req.body.postcode,
      city: req.body.city,
    },
    { new: true }
  );
  if (!user) {
    res.status(404).send('User not found');
  }
  res.send(user);
});

//count users
router.get('/count', async (req, res) => {
  try {
    const count = await User.countDocuments((count) => {
      return count;
    });
    res.status(200).json({ userCount: count });
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
