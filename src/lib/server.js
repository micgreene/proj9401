'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('../routes/auth-routes.js');
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(authRoutes);

module.exports = {
  server: app,
  start: (port) => {
    if(!port) throw new Error('No PORT provided!');

    app.listen(port, () => {
      console.log(`Server now listening on Port: ${port}`);
    })
  }
}