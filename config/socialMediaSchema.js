"use strict";
let mongoose = require('mongoose')
let socialMediaSchema = new mongoose.Schema({
    user: String,
    authorised: Boolean
  });

  module.exports = mongoose.model('SocialMedia', socialMediaSchema)