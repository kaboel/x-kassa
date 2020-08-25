const Transaction = require('../_model/Transaction');
const Menu = require('../_model/Menu');
const { Types } = require('mongoose');

const getTotalBill = (orders) => {
  if (!Array.isArray(orders)) return false;
  let ids = orders.map(item => {
    return Types.ObjectId(item.itemId);
  });
  let amount = (id) => {
    let item = orders.find(item => item.itemId === id);
    return item.amount;
  }
  Menu.find({ '_id': { $in: ids }}, (err, items) => {
    if (err || !items) return false;
    let total = 0;
    items.forEach((item, index) => {
      total += amount(item._id) * item.price;
    });
    return total;
  });
}

const getOrderItems = (orders) => {
  if (!Array.isArray(orders)) return false;
  let ids = orders.map(item => {
    return Types.ObjectId(item.itemId);
  });
  let amount = (id) => {
    let item = orders.find(item => item.itemId === id);
    return item.amount;
  }
  Menu.find({'_id': {$in: ids}}, (err, items) => {
    if (err || !items) return false;
    items.forEach((item, index) => {
      item.amount = amount(item._id);
      item.totalPrice = amount(item._id) * item.price;
    });
    return items;
  })
}

const omitTransaction = async (req, res) => {
  if (!req.userId) return res.status(401).send({
    message: 'Access token not provided!'
  });
  let total = getTotalBill(req.body.orders);
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
      message: 'Transaction successful!'
    });
  });
}

const getTransactionDetail = (req, res) => {
  if (!req.userId) return res.status(401).send({
    message: 'Access token not provided!'
  });
  try {
    Transaction.findOne({_id: req.params.id}).then((transaction) => {
      let orders = getOrderItems(transaction.orders);
      if (!orders) return res.status(500).send({
        message: 'An unexpected error has occured while fetching order items!'
      });
      res.status(200).send({
        date: transaction.date,
        orders: orders,
        total: transaction.total,
      });
    });
  } catch (e) {
    return res.status(500).send({
      message: 'An error has occured while fetching transaction detail.'
    });
  }
}

module.exports = {
  omitTransaction,
  getTransactionDetail,
}