const mongoose = require('mongoose');

const TransactionSchema = mongoose.Schema({
  date: {
    type: Date,
    default: Date.now(),
  },
  total: {
    type: Number,
    required: true
  },
  orders: {
    type: [Object],
    required: true
  }
});

const Transaction = mongoose.model('Transaction', TransactionSchema, 'Transactions');

module.exports = Transaction;