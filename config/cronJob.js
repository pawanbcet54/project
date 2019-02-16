"use strict";
/*this is no more required as expiration is setup in schema itself
exports.cleanupDB = function (time) {
    var requiredTime = new Date().getTime() - time;
    console.log(requiredTime);
    var cron = require('node-cron');
    var db = require('./db.js')
    cron.schedule('* * * * *', () => {
        console.log('running a task every minutes');
        db.removeChatMessage(requiredTime)
        .then(function(response){
            console.log(response);
        })
        .catch(function(error){
            console.log(error);
        })
    });
}
*/

exports.updateOfflineStatus = function (time) {
    var cron = require('node-cron');
    var db = require('./db.js')
    cron.schedule('*/'+process.env.ChatOfflineTime+' * * * *', () => {
        console.log('running a task 10 minutes');
        db.updateOfflineStatus()
        .then(function(response){
            console.log(response);
        })
        .catch(function(error){
            console.log(error);
        })
    });
}