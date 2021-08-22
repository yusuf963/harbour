const mongoose = require('mongoose');
const itemSchema = mongoose.Schema({
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
  price: {
    type: Number,
    default: 0,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  rate: {
    type: Number,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  dateCraeted: {
    type: Date,
    default: Date.now,
  },
});

itemSchema.virtual('id').get(function () {
  return this._id.toString();
});
itemSchema.set('toJSON', {
  virtuals: true,
});
const Item = mongoose.model('Item', itemSchema);
module.exports = Item;
