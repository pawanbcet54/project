"use strict";
let mongoose = require('mongoose')
let onlineUserSchema = new mongoose.Schema({
    user: String,
    online: Boolean
  });

  module.exports = mongoose.model('OnlineUser', onlineUserSchema)