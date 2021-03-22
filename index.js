'use strict';

const mongoose = require('mongoose');

const server = require('./src/lib/server.js');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/auth2';
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
};

mongoose.connect(MONGODB_URI, mongooseOptions)
.then(() => {
  server.start(PORT);
});

