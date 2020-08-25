const mongoose = require('mongoose');

const TransactionSchema = mongoose.Schema({
  date: {
    type: Date,
    default: Date.now(),
  },
  cashier: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  orders: {
    type: [Object],
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
  }
});

const Transaction = mongoose.model('Transaction', TransactionSchema, 'Transactions');

module.exports = Transaction;