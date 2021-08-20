const express = require('express');
const router = express.Router();
const Category = require('../models/category');

// Get all categories
router.get('/', async (req, res) => {
  const categoryList = await Category.find();
  if (!categoryList) {
    res.status(404).send('Not found');
  }
  res.send(categoryList);
});

// Get category by id
router.get('/:id', async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404).send('Not found');
  }
  res.send(category);
});

// Create new category
router.post('/', async (req, res) => {
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
module.exports = router;
