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
          res.sendStatus(200);
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
          res.sendStatus(200);
        });
      }
    } catch (e) {
      return res.status(500).send({
        error: 'An error has occured while updating menu list.'
      });
    }
  } else {
    return res.status(401).send({
      error: 'Access/Role Unauthorized!'
    });
  }
}

const deleteMenu = async (req, res) => {
  if (req.userId && req.roleAuth) {
    Menu.findById(req.body._id, (err, menu) => {
      if (err || !menu) return res.status(500).send({
        error: 'An error has occured while deleting item.'
      });
      Menu.deleteOne({ _id: menu._id }).then(() => {
        res.sendStatus(200);
      }).catch(err => {
        return res.status(500).send({
          error: 'An error has occured while deleting item.'
        });
      });
    });
  } else {
    return res.status(401).send({
      error: 'Access/Role Unauthorized!'
    });
  }
}

const getAllMenu = (req, res) => {
  Menu.find({}).then((menu) => {
    res.status(200).send(menu);
  }).catch((err) => {
    return res.status(500).send({
      error: 'An error has occured while fetching menu data.'
    });
  });
}

module.exports = {
  upsertMenu,
  deleteMenu,
  getAllMenu,
}