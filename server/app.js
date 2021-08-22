const express = require('express');
require('dotenv/config');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

//import routes files
const itemRouter = require('./views/item');
const userRouter = require('./views/user');
const categoryRouter = require('./views/category');
const orderRouter = require('./views/order');

const app = express();
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);
const api = process.env.API_URL;

// API routes
app.use('/items', itemRouter);
app.use('/users', userRouter);
app.use('/category', categoryRouter);
app.use('/orders', orderRouter);

// Connect to MongoDB
mongoose.set('useCreateIndex', true);
mongoose
  .connect(process.env.DB_CONNECTION_STRING, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    dbName: 'harbour',
  })
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((err) => {
    console.log(err);
  });

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(api);
  console.log(`Listening on port ${port}`);
});
