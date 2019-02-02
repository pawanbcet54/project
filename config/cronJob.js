/*this is no more required as expiration is setup in schema itself
"use strict";

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