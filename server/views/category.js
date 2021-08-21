const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const mongoose = require('mongoose');

// Get all categories
router.get('/', async (req, res) => {
  const categoryList = await Category.find();
  if (!categoryList) {
    res.status(404).json({ sucess: false, message: 'Not found' });
  }
  res.send(categoryList);
});

// Get category by id
router.get('/:id', async (req, res) => {
  // Get id from url mongoose id validation
  idValidation(req, res);
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404).send('Not found');
  }
  res.send(category);
});

// Create new category
router.post('/', async (req, res) => {
  // Check if category already exists
  const checkingCategory = await Category.findOne({ name: req.body.name });
  if (checkingCategory) {
    res.status(400).send('Category already exists');
  }
  let category = new Category({
    name: req.body.name,
    color: req.body.color,
    icon: req.body.icon,
  });
  try {
    category = await category.save();
    res.send(category);
  } catch (error) {
    res.status(400).json({ error: error, message: 'Bad request' });
  }
});

//delete  one category
router.delete('/:id', (req, res) => {
  // Get id from url mongoose id validation
  idValidation(req, res);
  Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        return res
          .status(200)
          .json({ sucess: true, message: 'Category deleted' });
      } else {
        return res
          .status(404)
          .json({ sucess: false, message: 'Category not found' });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, message: err });
    });
});

//update one category
router.put('/:id', async (req, res) => {
  // Get id from url mongoose id validation
  idValidation(req, res);
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      color: req.body.color,
      icon: req.body.icon,
    },
    { new: true }
  );
  if (!category) {
    res.status(404).send('Category not found');
  }
  res.send(category);
});

//count category
router.get('/get/count', async (req, res) => {
  const categoryCount = await Category.countDocuments((count) => count);
  if (!categoryCount) res.status(404).send('Not found');
  res.status(200).json({ categoryCount: categoryCount });
});

module.exports = router;
