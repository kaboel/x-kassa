const App = require('express')();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const { port } = require('./config');

App.use(cors({ credentials: true, origin: true }));
App.use(morgan('combined'));

App.use(bodyParser.urlencoded({ extended: true }))
App.use(bodyParser.json());

try {
  App.listen(port, () => {
    console.log(`Server started on port: ${port}...`)
  })
} catch (e) {
  console.log(`Server failed to start. | ${e}`)
}