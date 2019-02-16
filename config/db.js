"use Strict";
const mongoose = require('mongoose');
var onlineUser = require('./onlineUserSchema.js');
var chat = require('./chatMessageSchema.js');
var social = require('./socialMediaSchema.js')

exports.addOnlineUser = function (user) {
    let userSchema = new onlineUser({
        user: user,
        online: true
    });
    return userSchema.save(userSchema)
        .then(function (response) {
            return response;
        })
        .catch(function (error) {
            return error;
        })
};

exports.updateOfflineStatus = function () {
    return onlineUser.updateMany({}, { $set: { online: false } })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (err) {
            console.log(err);
        })
}

exports.updateOnlineStatusToTrue = function (user) {
    let userSchema = new onlineUser({
        user: user,
        online: true
    });
    return userSchema.updateOne(userSchema)
        .then(function (response) {
            return response;
        })
        .catch(function (error) {
            return error;
        })
};

exports.getOnlineUser = function () {
    return onlineUser.find({
        online: true
    })
        .then(function (response) {
            var responseToReturn = response.map(function (item) {
                return item.user;
            });
            return responseToReturn;
        })
        .catch(function (error) {
            return error;
        })
};

exports.getOneOnlineUser = function (user) {
    return onlineUser.find({ user: user })
        .then(function (response) {
            return response;
        })
        .catch(function (error) {
            return error;
        })
};

exports.deleteOnlineUser = function (user) {
    return onlineUser.deleteMany({ user: user })
        .then(function (response) {
            return response;
        })
        .catch(function (error) {
            return error;
        })
};

exports.deleteAllOnlineUsers = function () {
    return onlineUser.deleteMany()
        .then(function (response) {
            return response;
        })
        .catch(function (error) {
            return error;
        })
};

exports.deleteMessage = function (id) {
    console.log(id);
    return chat.deleteOne({ _id: id })
        .then(function (response) {
            console.log(response);
            return response;
        })
        .catch(function (error) {
            return error;
        })
};

exports.addChatMessage = function (to, from, message, time) {
    let chatMessage = new chat({
        to: to,
        from: from,
        message: message,
        time: time
    });
    return chatMessage.save()
        .then(function (response) {
            return response;
        })
        .catch(function (error) {
            return error;
        })
};
/* this is no more required as expiration is setup in schema itself
exports.removeChatMessage = function (time) {
    console.log(new Date(time));
    return chat.deleteMany({time:{$lte:new Date(time)}})
        .then(function (response) {
            return response;
        })
        .catch(function (error) {
            return error;
        })
};
*/

exports.getChatMessage = function (to, from) {
    return chat.find({ $or: [{ to: to }, { from: to }, { to: from }, { from: from }] }).sort('-date').limit(parseInt(process.env.MessageLimitInOneRequest))
        .then(function (response) {
            if (response.length > 50)
                response.slice(Math.max(arr.length - 50, 1))
            return response;
        })
        .catch(function (error) {
            return error;
        })
};

exports.validateChatMessage = function (obj) {
    return chat.find(obj)
        .then(function (response) {
            return response;
        })
        .catch(function (error) {
            return error;
        })
};

exports.addSocialMediaUsers = function (user) {
    var request = new social({
        user: user,
        authorised: true
    });
    return social.find({
        user: user
    })
        .then(function (response) {
            if (response.length == 0) {
                return request.save();
            }
            else {
                return null;
            }
        })
        .then(function (response) {
            return response;
        })
        .catch(function (error) {
            return error;
        })
};
exports.getSocialMediaUsers = function () {
    return social.find()
        .then(function (response) {
            return response;
        })
        .catch(function (error) {
            return error;
        })
}