const App = require('express')();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const { port, dbUri } = require('./config');

App.use(cors({ credentials: true, origin: true }));
App.use(morgan('combined'));

App.use(bodyParser.urlencoded({ extended: true }));
App.use(bodyParser.json());

App.use('/api', require('./_router'));

const db = mongoose.connection;
db.on('connecting', () => console.log('Connecting to database @kluster-0-kassa-serv...'))
mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log(`Database connected!\n.\n.\n.`);
  try {
    App.listen(port, () => {
      console.log(`X-KASSA started on port: ${port}...`);
    });
  } catch (e) {
    console.log(`X-KASSA failed to start. | ${e}`);
  }
}).catch(err => {
  console.log(`Database connection error: ${err}`);
})