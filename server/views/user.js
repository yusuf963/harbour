const express = require('express');
const User = require('../models/user');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const idValidation = require('../helpers/checkid');

// mongoose id validation, custom function, Get id from url mongoose id validation
// const idValidation = (req, res) => {
//   const idValidation = mongoose.isValidObjectId(req.params.id);
//   if (!idValidation) {
//     return res.status(400).send('Invalid id');
//   }
// };

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
  //Get id from url mongoose id validation
  idValidation(req, res);
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    return res.status(404).send('User not found');
  }
  res.send(user);
});

//deletes a user
router.delete('/:id', (req, res) => {
  // Get id from url mongoose id validation
  idValidation(req, res);
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

//update a user
router.put('/:id', async (req, res) => {
  // Get id from url mongoose id validation
  idValidation(req, res);
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
      phone: req.body.phone,
    },
    { new: true }
  );
  if (!user) {
    res.status(404).send('User not found');
  }
  res.send(user);
});

//Create a new user
router.post('/register', async (req, res) => {
  // const saltString = process.env.SALT_KEY;
  // // console.log(salt);
  // //check if the user already exists
  // const checkingUser = await User.findOne({ email: req.body.email });
  // if (checkingUser) {
  //   return res.status(400).send('User already exists');
  // }
  //create a new user
  let user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bycrypt.hashSync(req.body.password, 10),
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
// login
router.post('/login', async (req, res) => {
  const secret = process.env.SECRET_KEY;
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).send('Hmm, User not found');
  }
  // if (!bycrypt.compareSync(req.body.password, user.password)) {
  //   return res.status(401).send('Wrong password');
  // }
  const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, secret, {
    expiresIn: '1d',
  });
  res.status(200).send({ user: user, token: token });
});
//count users
router.get('/get/count', async (req, res) => {
  const userCount = await User.countDocuments((count) => count);
  if (!userCount) res.status(4.4).send('No users found');
  res.status(200).json({ userCount: userCount });
});

module.exports = router;
