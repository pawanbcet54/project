var express = require('express');
var path = require('path');
var db = require('../config/db.js');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/addOnlineUser', function (req, res, next) {
  if (req.body.user == undefined || req.body.user == "" || req.body.user == " " || req.body.user == null) {
    res.json("Error: User is Invalid or not defined!!");
  }
  else {
    return db.getOneOnlineUser(req.body.user)
      .then(function (response) {
        if (response)
          if (response.length > 0) {
            console.log('The User length is more' + response.length);
            return db.updateOnlineStatusToTrue(req.body.user)
          }
          else {
            return db.addOnlineUser(req.body.user);
          }
      })
      .then(function (response) {
        if (response != null || response != undefined) {
          var finalResponse = response.map(function (items) {
            return items.user;
          })
          res.json(finalResponse);
        }
        else{
          res.json(response);
        }
      })
      .catch(function (error) {
        res.json(error);
      })
  }
});

router.get('/getOnlineUser', function (req, res, next) {
  return db.getOnlineUser()
    .then(function (response) {
      res.json(response);
    })
    .catch(function (error) {
      res.json(error);
    })
});

router.post('/removeOnlineUser', function (req, res, next) {
  if (req.body.user == undefined || req.body.user == null || req.body.user == "") {
    res.json("User is either not defined or null or empty");
  }
  else {
    if (req.body.user == process.env.APPID)
      return db.deleteAllOnlineUsers();
    else
      return db.deleteOnlineUser(req.body.user)
        .then(function (response) {
          res.json(response);
        })
        .catch(function (error) {
          res.json(error);
        })
  }
});

router.post('/deleteMessage', function (req, res, next) {
  var id = req.body.id;
  return db.deleteMessage(id)
    .then(function (response) {
      res.json(response);
    })
    .catch(function (error) {
      res.json(error);
    })
});

router.post('/getMessage', function (req, res, next) {
  var user1 = req.body.user1;
  var user2 = req.body.user2;
  return db.getChatMessage(user1, user2)
    .then(function (response) {
      res.json(response);
    })
    .catch(function (error) {
      res.json(error);
    })
});

router.post('/getAllMessagesForUser', function (req, res, next) {
  var user = req.body.user;
  return db.getChatMessage(user, user)
    .then(function (response) {
      res.json(response);
    })
    .catch(function (error) {
      res.json(error);
    })
});

router.post('/addMessage', function (req, res, next) {
  var to = req.body.to,
    from = req.body.from,
    message = req.body.message,
    time = req.body.time;
  return db.validateChatMessage({
    to: to,
    from: from,
    message: message,
    time: time
  })
    .then(function (response) {
      if (response.length == 0)
        return db.addChatMessage(to, from, message, time);
      else
        return null;
    })
    .then(function (response) {
      res.json(response);
    })
    .catch(function (error) {
      res.json(error);
    })
});

router.post('/addSocialMediaUsers', function (req, res, next) {
  var user = req.body.user;
  return db.addSocialMediaUsers(user)
    .then(function (response) {
      res.json(response);
    })
    .catch(function (error) {
      res.json(error);
    })
});

router.get('/getSocialMediaUsers', function (req, res, next) {
  return db.getSocialMediaUsers()
    .then(function (response) {
      res.json(response);
    })
    .catch(function (error) {
      res.json(error);
    });
});

router.post('/payment', function (req, res, next) {
  var Eos = require('eosjs');
  var from = req.body.from,
    to = req.body.to,
    privateKey = req.body.privateKey,
    amount = req.body.amount,
    currency = req.body.currency;
  var transactionId;
  var config = {
    broadcast: true,
    debug: true,
    sign: true,
    authorization: from + '@active',
    keyProvider: privateKey,
    httpEndpoint: process.env.httpEndpoint,
    chainId: process.env.chainId
  };
  var eos = Eos(config);
  return eos.transfer({
    from: from,
    to: to,
    quantity: parseInt(amount).toFixed(4) + ' ' + currency,
    memo: new Date()
  })
    .then(function (response) {
      transactionId = response.transaction_id;
      var chat = {
        from: from,
        to: to,
        message: '<strong>New Transaction<strong> <br/> ' + from + ' => ' + to + ' </br><strong>' + amount + ' ' + currency + '</strong><br/> <a href="/getPaymentDetails/' + from + '/' + to + '/' + amount + '/' + currency + '/' + response + '">Know More</a>',
        time: new Date()
      }
      return db.addChatMessage(chat.to, chat.from, chat.message, chat.time);
    })
    .then(function (response) {
      res.json(transactionId);
    })
    .catch(function (error) {
      console.log(error);
      res.send("There was Error making payment");
    })
});
router.get('/payment/:to', function (req, res, next) {
  res.render('payment', { to: req.params.to });
});

module.exports = router;
