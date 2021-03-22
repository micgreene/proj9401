'use strict';

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET_CODE = process.env.SECRET_CODE || 'dawg';

const users = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'user', enum: ['user', 'editor', 'admin'] },
},
  {toJSON: { virtuals: true }});

users.virtual('token').get(function(){
  let token = {
    username: this.username
  }
  return jwt.sign(token, SECRET_CODE);
});

  users.pre('save', async function(){
    this.password = await bcrypt.hash(this.password, 5);
  });

  users.statics.authenticateBasic = async function(username, password){
    const user = await this.findOne({ username });
    const valid = await bcrypt.compare(password, user.password);

    if(valid) { return user; }

    throw new Error('invalid username or password');


  }

  module.exports = mongoose.model('users', users);
