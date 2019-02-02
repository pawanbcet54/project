"use strict";
let mongoose = require('mongoose')
let onlineUserSchema = new mongoose.Schema({
    user: String
  });

  module.exports = mongoose.model('OnlineUser', onlineUserSchema)