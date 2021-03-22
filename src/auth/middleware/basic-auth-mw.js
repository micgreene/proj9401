'use strict';

const base64 = require('base-64');
const users = require('../../models/users.js');

module.exports = (req, res, next) => {
  if(!req.headers.authorization){
    next('not authroized');
    return;
  }

  let basic = req.headers.authorization.split(' ').pop();

  let [user, pass] = base64.decode(basic).split(':');

  users. authenticateBasic(user, pass)
  .then(user => {
    req.user = user;
    next();
  }).catch(e => {
    next('user not valid!');
  })
}
