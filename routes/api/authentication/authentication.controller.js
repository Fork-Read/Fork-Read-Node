var
  User = require('./../user/user.model'),
  Otp = require('./otp.model'),
  helpers = require('../helpers'),
  twilio = {
    'accountSid': 'AC688715f5b7d28ed07ee03e71b6364c08',
    'authToken': 'b4e755e60cea3299ca44afaa85702418'
  };

// //mail gun api key
// api_key = 'key-6a53211a108d8c3d54eef6c5dd65d3b2',
// //mail gun  domain name 
// domain = 'sandbox025db70253544252bf9ce075f1eebc16.mailgun.org',
// Mailgun = require('mailgun-js'),
// mailgun = new Mailgun({
//   apiKey: api_key,
//   domain: domain
// })

twilio.client = require('twilio')(twilio.accountSid, twilio.authToken);

var controller = {

  otp: function (number) {

    Otp.findOne({
      'number': number
    }, function (err, otpObj) {
      if (err) {
        return false;
      }

      if (!otpObj) {

        var otp = Math.floor(Math.random() * 90000) + 10000;

        // Add OTP to server
        Otp.create({
          'number': number,
          'otp': otp
        }, function (err, obj) {
          if (err) {
            return false;
          }

          twilio.client.messages.create({
            to: number.toString(),
            from: "+12017731151",
            body: 'Enter ' + otp + ' for one time verification of your number on ForkRead.',
          }, function (err, message) {
            return true;
          });
        });

      } else {
        var otp = Math.floor(Math.random() * 90000) + 10000;

        Otp.update({
          'number': number
        }, {
          'otp': otp
        }, function (err, obj) {
          if(err) {
            return helpers.handleError(res, err);
          }

          twilio.client.messages.create({
            to: number.toString(),
            from: "+12017731151",
            body: 'Enter ' + otp + ' for one time verification of your number on ForkRead.',
          }, function (err, message) {
            return true;
          });
        });
      }
    })
  },
  resend: function (req, res) {
    Otp.findOne({
      'number': req.body.number
    }, function(err, obj){
      if (err){
        return helpers.handleError(res, err);
      }

      if(obj){
        twilio.client.messages.create({
          to: req.body.number.toString(),
          from: "+12017731151",
          body: 'Enter ' + obj.otp + ' for one time verification of your number on ForkRead.',
        }, function (err, message) {
          res.send(200).json({});
        });
      } else {
        var otp = Math.floor(Math.random() * 90000) + 10000;

        // Add OTP to server
        Otp.create({
          'number': req.body.number,
          'otp': otp
        }, function (err, obj) {
          if (err) {
            return helpers.handleError(res, err);
          }

          twilio.client.messages.create({
            to: req.body.number.toString(),
            from: "+12017731151",
            body: 'Enter ' + otp + ' for one time verification of your number on ForkRead.',
          }, function (err, message) {
            res.send(200).json({});
          });
        });
      }
    });
  },
  verify: function (req, res) {
    Otp.findOne({
      'number': req.body.number
    }, function (err, obj) {
      if (err) {
        return helpers.handleError(res, err);
      }

      if(obj.otp == req.body.otp){
        User.update({
          'number': req.body.number
        }, {
          'isVerified': true
        }, function (err, user) {
          if(err) {
            return helpers.handleError(res, err);
          }

          if(user){
            res.status(201).json({
              'id': user.id,
              'accessToken': user.accessToken
            });
          }
        });
      } else {
        res.status(200).json({
          'isVerified': false
        });
      }
    })
  }
}

module.exports = controller;