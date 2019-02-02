"use strict";
let mongoose = require('mongoose')
let chatMessageSchema = new mongoose.Schema({
    from: String,
    to: String,
    message: String,
    time: String,
    expireAfterSeconds: parseInt(process.env.ThresholdTime)
});

module.exports = mongoose.model('Chat', chatMessageSchema)