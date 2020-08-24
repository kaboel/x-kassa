const Menu = require('../_model/Menu');

const upsertMenu = async (req, res) => {
  if (req.userId, req.roleAuth) {
    let query = {};
    let update = {};
    let options = {
      new: true,
      upsert: true,
      setDefaultOnInsert: true,
    };
    if (req.body._id) query._id = req.body._id;
    if (req.body.name) update.name = req.body.name;
    if (req.body.price) update.price = req.body.price;
    if (req.body.discount) update.discount = req.body.discount;
    if (req.body.type) update.type = req.body.type;

    Menu.findOneAndUpdate(query, update, options, (err, menu) => {
      if (err || !menu) {
        return res.status(500).send({
          message: 'An error has occured while updating menu list.'
        });
      }
      res.status(200).send({
        message: 'Menu list updated!'
      });
    });
  } else {
    return res.status(401).send({
      message: 'Access/Role Unauthorized!'
    });
  }
}

const deleteMenu = async (req, res) => {
  if (req.userId && req.roleAuth) {
    Menu.findById(req.body._id, (err, menu) => {
      if (err || !menu) {
        return res.status(500).send({
          message: 'An error has occured while deleting item.'
        });
      }
      Menu.deleteOne({ _id: menu._id }).then(() => {
        res.status(200).send({
          message: 'An item has been deleted!'
        })
      }).catch(err => {
        return res.status(500).send({
          message: 'An error has occured while deleting item.'
        });
      })
    })
  } else {
    return res.status(401).send({
      message: 'Access/Role Unauthorized!'
    });
  }
}

module.exports = {
  upsertMenu,
  deleteMenu
}