const Transaction = require('../_model/Transaction');
const Menu = require('../_model/Menu');
const mongoose = require('mongoose');

const countTotal = (orders) => {
  if (!Array.isArray(orders)) return false;
  let ids = orders.map(order => {
    return mongoose.Types.ObjectId(order.itemId);
  });
  Menu.find({ '_id': { $in: ids }}, (err, docs) => {
    if (err || !docs) return false;
    return docs.reduce((a, b) => a + b, 0);
  });
}

const omitTransaction = async (req, res) => {
  if (!req.userId) return res.status(401).send({
    message: 'Access token not provided!'
  });
  let total = countTotal(req.body.orders);
  if (!total) return res.status(500).send({
    message: 'An error has occured while omitting transaction.'
  });
  let newTransaction = new Transaction({
    orders: req.body.orders,
    total: total
  });
  await newTransaction.save().then((response) => {
    res.status(200).send({
      _id: response._id,
      date: response.date,
      orders: response.order,
      total: response.order,
      message: 'Transaction successful!'
    });
  });
}

module.exports = {
  omitTransaction
}