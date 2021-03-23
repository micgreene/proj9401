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

users.virtual('capabilities').get(function(){
  let acl ={
    user: ['read'],
    editor: ['read', 'create', 'update'],
    admin: ['read', 'create', 'update', 'delete']
  }
  return acl[this.role];
})

  users.pre('save', async function(){
    this.password = await bcrypt.hash(this.password, 5);
  });

  users.statics.authenticateBasic = async function(username, password){
    const user = await this.findOne({ username });
    const valid = await bcrypt.compare(password, user.password);

    if(valid) { return user; }

    throw new Error('invalid username or password');
  }

  users.statics.authenticateToken = async function(token){
    try{
      const parsed = await jwt.verify(token, SECRET_CODE);
      const user = await this.findOne({username: parsed.username})

      if(user) return user;
      throw new Error('User not found!');
    } catch(e){
      throw new Error(e.message);
    }
  }

  module.exports = mongoose.model('users', users);
