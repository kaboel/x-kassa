const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
  itemId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    default: 1
  }
});

const TransactionSchema = mongoose.Schema({
  date: {
    type: Date,
    default: Date.now(),
  },
  total: {
    type: Number,
    required: true
  },
  orders: [ItemSchema]
});

const Transaction = mongoose.model('Transaction', TransactionSchema, 'Transactions');

module.exports = Transaction;