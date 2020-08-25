const Menu = require('../_model/Menu');

const upsertMenu = async (req, res) => {
  if (req.userId, req.roleAuth) {
    try {
      if (req.body._id) {
        let update = {}
        if (req.body.name) update.name = req.body.name;
        if (req.body.price) update.price = req.body.price;
        if (req.body.discount) update.discount = req.body.discount;
        if (req.body.type) update.type = req.body.type;
        Menu.findOneAndUpdate({_id: req.body._id}, update, (err, menu) => {
          res.status(200).send({
            message: 'Menu list updated!'
          });
        });
      } else {
        let menu = {
          name: req.body.name,
          price: req.body.price,
        }
        if (req.body.discount) newMenu.discount = req.body.discount;
        if (req.body.type) newMenu.type = req.body.type;
        let newMenu = new Menu(menu);
        await newMenu.save().then((response) => {
          res.status(200).send({
            message: 'Menu list updated!'
          });
        });
      }
    } catch (e) {
      return res.status(500).send({
        message: 'An error has occured while updating menu list.'
      });
    }
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
        });
      }).catch(err => {
        return res.status(500).send({
          message: 'An error has occured while deleting item.'
        });
      });
    });
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