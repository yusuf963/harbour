const express = require('express');
const router = express.Router();
const Item = require('../models/item');
const Category = require('../models/category');
const multer = require('multer');
const idValidation = require('../helpers/checkid');

//stor asset/imgs
const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error('invalid image type');

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, 'public/uploads');
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(' ').join('-');
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

// Get all items
router.get('/', async (req, res) => {
  // request items by category name
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(',') };
  }
  console.log(filter);
  try {
    const itemList = await Item.find(filter);
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
  // Get id from url mongoose id validation
  idValidation(req, res);
  const item = await Item.findById(req.params.id);
  if (!item) {
    return res.status(404).send('No item found');
  }
  res.status(200).json(item);
});

//create item
router.post('/', uploadOptions.single('image'), async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(404).send('Category not found');

  const file = req.file;
  if (!file) return res.status(400).send('No image in the request');

  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

  let item = new Item({
    name: req.body.name,
    description: req.body.description,
    image: `${basePath}${fileName}`,
    price: req.body.price,
    category: req.body.category,
    rate: req.body.rate,
    isFeatured: req.body.isFeatured,
  });
  item = await item.save();
  if (!item) return res.status(404).send('Item not found');
  res.status(200).json(item);
});

//delete item
router.delete('/:id', async (req, res) => {
  // Get id from url mongoose id validation
  idValidation(req, res);
  const item = await Item.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).send('Item not found');
  res.status(200).json(item);
});

//update item
router.put('/:id', uploadOptions.single('image'), async (req, res) => {
  // Get id from url mongoose id validation
  idValidation(req, res);
  //check category if its valid/ found
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(404).send('Category not found');

  //check if the item excist
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(400).send('item not found');
  const file = req.file;
  let imagePath;
  if (file) {
    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    imagePath = `${basePath}${fileName}`;
  } else {
    imagePath = item.image;
  }
  const updatedItem = await Item.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      image: imagePath,
      price: req.body.price,
      category: req.body.category,
      rate: req.body.rate,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  );
  if (!updatedItem) return res.status(404).send('Item not found');
  res.status(200).json(item);
});

//upload multi images
router.put(
  '/gallary/:id',
  uploadOptions.array('images', 10),
  async (req, res) => {
    idValidation();
    const files = req.files;
    let imagePaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    if (files) {
      files.map((file) => {
        imagesPaths.push(`${basePath}${file.fileName}`);
      });
    }
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      {
        images: imagesPaths,
      },
      { new: true }
    );
    if (!item) return res.status(404).send('Item not found');
    res.status(200).json(item);
  }
);

//count the number of items is listed
router.get('/get/count', async (req, res) => {
  const itemCount = await Item.countDocuments((count) => count);
  if (!itemCount) return res.status(404).send('No items found');
  res.status(200).json({ itemCount: itemCount });
});

//get featured item and limitem count
router.get('/get/featured/:count', async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const featuredItem = await Item.find()
    .where('isFeatured')
    .equals(true)
    .limit(+count);
  if (!featuredItem) return res.status(404).send('No items found');
  res.status(200).json(featuredItem);
});

const upload = multer({ storage: storage });
module.exports = router;
