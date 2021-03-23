'use strict';

const express = require('express');
const path = require('path');

const User = require('../models/users.js');
const basicAuth = require('../../middleware/auth/basic-auth-mw.js');
const bearerAuth = require('../../middleware/auth/bearer-auth-mw.js');
const acl = require('../../middleware/auth/acl-mw.js');

const authRoute = express.Router();

authRoute.get('/', (request, response) => {
  console.log('started');
  response.sendFile('/home/micgreene/codefellows/401/proj9401/public/html/sign-up.html');
});

authRoute.get('/sign-in', (request, response) => {
  console.log('sign in now');
  response.sendFile('/home/micgreene/codefellows/401/proj9401/public/html/sign-in.html');
});

authRoute.post('/sign-up', async (req, res)=>{
  let user = new User(req.body);
  const newUser = await user.save();
  console.log('user: ', user);
  res.status(201).json(newUser);  
})

authRoute.post('/sign-in', basicAuth, (req,res)=>{
  let userDetails = {
    details: req.user,
    token: req.user.token
  }
  console.log('userDetails: ', userDetails);
  res.status(200).json(userDetails);  
});

authRoute.put('/edit-user', bearerAuth, (req, res) => {

})

authRoute.get('/protecc-route', bearerAuth, acl('read'), (req,res)=>{
  res.status(200).send('You are signed in and have proper permissions');
})

module.exports = authRoute;