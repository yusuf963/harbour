const express = require('express');
const router = express.Router();
const Item = require('../models/item');
const Category = require('../models/category');
const monngoose = require('mongoose');

// mongoose id validation, custom function, Get id from url mongoose id validation
const idValidation = (req, res) => {
  const idValidation = monngoose.isValidObjectId(req.params.id);
  if (!idValidation) {
    return res.status(400).send('Invalid id');
  }
};

// Get all items
router.get('/', async (req, res) => {
  try {
    const itemList = await Item.find();
    if (!itemList) {
      return res.status(404).send('No items found');
    }
    res.status(200).json(itemList);
  } catch (error) {
    return res.status(500).send(error);
  }
});
// Get item by id
router.get('/:id', async (req, res) => {
  idValidation(req, res);
  const item = await Item.findById(req.params.id).populate('category');
  if (!item) {
    return res.status(404).send('No item found');
  }
  res.status(200).json(item);
});

//create item
router.post('/', async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(404).send('Category not found');

  let item = new Item({
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    image: req.body.image,
    isFeatured: req.body.isFeatured,
  });
  item = await item.save();
  if (!item) return res.status(404).send('Item not found');
  res.status(200).json(item);
});

//delete item
router.delete('/:id', async (req, res) => {
  // Get id from url mongoose id validation
  const idValidation = monngoose.isValidObjectId(req.params.id);
  if (!idValidation) {
    return res.status(400).send('Invalid id');
  }
  const item = await Item.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).send('Item not found');
  res.status(200).json(item);
});

//update item
router.put('/:id', async (req, res) => {
  // Get id from url mongoose id validation
  const idValidation = monngoose.isValidObjectId(req.params.id);
  if (!idValidation) {
    return res.status(400).send('Invalid id');
  }
  const item = await Item.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      image: req.body.image,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  );
  if (!item) return res.status(404).send('Item not found');
  res.status(200).json(item);
});

//count the number of items is listed
router.get('/count', async (req, res) => {
  try {
    const count = await Item.countDocuments((count) => {
      return count;
    });
    res.status(200).json({ itemCount: count });
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
