const Transaction = require('../_model/Transaction');
const Menu = require('../_model/Menu');
const { Types } = require('mongoose');

const getTotalBill = async (orders) => {
  if (!Array.isArray(orders)) return false;
  let ids = orders.map(item => item.itemId);
  let items = await Menu.find({}).where('_id').in(ids).exec();
  if (!items) return false;
  let prices = [];
  items.forEach((item) => {
    orders.forEach((order) => {
      if (item._id == order.itemId) {
        prices.push(item.price * order.amount);
      }
    });
  });
  return prices.reduce((a, b) => a + b, 0);
}

const getOrderItems = async (orders) => {
  if (!Array.isArray(orders)) return false;
  let ids = orders.map(item => item.itemId);
  let items = await Menu.find({}).where('_id').in(ids).exec();
  if (!items) return false;
  items.forEach((item) => {
    orders.forEach((order) => {
      if (item._id == order.itemId) {
        item.amount = amount(item._id);
        item.totalPrice = amount(item._id) * item.price;
      }
    });
  });
  return items;
}

const makeTransaction = async (req, res) => {
  if (!req.userId) return res.status(401).send({
    error: 'Access token not provided!'
  });
  let total = await getTotalBill(req.body.orders);
  if (!total) return res.status(500).send({
    error: 'An error has occured while making transaction.'
  });
  let orders = req.body.orders;
  orders.forEach((order) => {
    order.itemId = Types.ObjectId(order.itemId);
  })
  let newTransaction = new Transaction({
    orders: orders,
    total: total
  });
  await newTransaction.save().then((response) => {
    res.status(200).send({
      _id: response._id,
    });
  });
}

const getTransactionDetail = (req, res) => {
  if (!req.userId) return res.status(401).send({
    message: 'Access token not provided!'
  });
  try {
    Transaction.findOne({_id: req.body._id}).then((transaction) => {
      let orders = getOrderItems(transaction.orders);
      if (!orders) return res.status(500).send({
        error: 'An unexpected error has occured while fetching order items!'
      });
      res.status(200).send({
        date: transaction.date,
        orders: orders,
        total: transaction.total,
      });
    });
  } catch (e) {
    return res.status(500).send({
      error: 'An error has occured while fetching transaction detail.'
    });
  }
}

module.exports = {
  makeTransaction,
  getTransactionDetail,
}