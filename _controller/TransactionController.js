const Transaction = require('../_model/Transaction');
const User = require('../_model/User');
const Menu = require('../_model/Menu');
const { Types } = require('mongoose');
const { format } = require('date-fns');

const getTotalBill = async (orders) => {
  if (!Array.isArray(orders)) return false;
  let ids = orders.map(item => item.itemId);
  let items = await Menu.find({}).where('_id').in(ids).exec();
  if (!items) return false;
  let prices = [];
  items.forEach((item) => {
    orders.forEach((order) => {
      if (item._id.toString() == order.itemId.toString()) {
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
  let result = []
  items.forEach(item => {
    orders.forEach(order => {
      if (item._id.toString() == order.itemId.toString()) {
        result.push({
          _id: item._id,
          name: item.name,
          price: item.price,
          amount: order.amount,
          subtotal: item.price * order.amount
        });
      }
    });
  });
  return result;
}

const getCashier = async (id) => {
  let user = await User.findById(id).exec();
  return (user) ? user : false;
}

const makeTransaction = async (req, res) => {
  if (!req.userId) return res.status(401).send({
    error: 'Access token not provided!'
  });
  let orders = req.body.orders;
  orders.forEach((order) => {
    order.itemId = Types.ObjectId(order.itemId);
  })
  let total = await getTotalBill(req.body.orders);
  if (!total) return res.status(500).send({
    error: 'An error has occured while making transaction.'
  });
  let newTransaction = new Transaction({
    operator: req.body.cashierId,
    orders: orders,
    total: total
  });
  await newTransaction.save().then((response) => {
    res.status(200).send({
      _id: response._id,
    });
  });
}

getTransactions = (req, res) => {
  if (!req.userId && !req.roleAuth) return res.status(401).send({
    error: 'Role unauthorized!'
  });
}

const getTransactionDetail = (req, res) => {
  if (!req.userId) return res.status(401).send({
    message: 'Access token not provided!'
  });
  try {
    Transaction.findOne({_id: req.params.id}).then( async (transaction) => {
      let orders = await getOrderItems(transaction.orders);
      let cashier = await getCashier(transaction.cashier);
      if (!orders || !operator) return res.status(500).send({
        error: 'An unexpected error has occured while fetching order items!'
      });
      res.status(200).send({
        _id: transaction._id,
        date: format(new Date(transaction.date), 'c/M/yyyy HH:mm'),
        cashier: {
          _id: cashier._id,
          name: cashier.name,
        },
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
  getTransactions,
  getTransactionDetail,
}