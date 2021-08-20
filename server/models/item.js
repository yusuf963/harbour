const mongoos = require('mongoose');
const itemSchema = mongoos.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
  },
  category: {
    type: mongoos.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  rate: {
    type: Number,
  },
  isFeatured:{
    type: Boolean,
    default: false,
},
  dateCraeted: {
    type: Date,
    default: Date.now,
  },
});
const Item = mongoos.model('Item', itemSchema);
module.exports = Item;
