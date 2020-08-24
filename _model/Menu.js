const mongoose = require('mongoose');

const Schema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    enum: ['food', 'beverages', 'add-on'],
    default: 'beverages'
  },
});

const Menu = mongoose.model('Menu', Schema, 'Menu');

module.exports = Menu;