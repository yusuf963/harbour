const express = require('express');
const router = express.Router();
const Item = require('../models/item');

router.get('/', async (req, res) => {
  const itemList = await Item.find();
  if (!itemList) {
    return res.status(404).send('No items found');
  }
  res.status(200).json(itemList);
});

router.post('/', (req, res) => {
  const item = new Item({
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    image: req.body.image,
  });
  item
    .save()
    .then((createdItem) => {
      res.status(201).json(createdItem);
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
        sucess: false,
        message: 'Creating a item failed!',
      });
    });
});
module.exports = router;
