var
  gcm = require('node-gcm'),
  async = require('async'),
  _ = require('underscore'),
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

  otp: function (req, res) {

    Otp.findOne({
      'number': req.body.number
    }, function (err, otpObj) {
      if (err) {
        return helpers.handleError(res, err);
      }

      if (!otpObj) {

        var otp = Math.floor(Math.random() * 90000) + 10000;

        // Add OTP to server
        Otp.create({
          'number': req.body.number,
          'otp': otp
        }, function (err, obj) {
          if (err) {
            return helpers.handleError(res, err);
          }
        });

        twilio.client.messages.create({
          to: req.body.number.toString(),
          from: "+12017731151",
          body: 'Enter ' + otp + ' for one time verification of your number on ForkRead.',
        }, function (err, message) {
          res.status(201).json({
            'otp': otp
          })
        });

      } else {
        var otp = Math.floor(Math.random() * 90000) + 10000;

        Otp.update({
          'number': req.body.number
        }, {
          'otp': otp
        }, function () {});

        twilio.client.messages.create({
          to: req.body.number.toString(),
          from: "+12017731151",
          body: 'Enter ' + otp + ' for one time verification of your number on ForkRead.',
        }, function (err, message) {
          res.status(201).json({
            'otp': otp
          })
        });
      }
    })

    // var data = {
    // //Specify email data
    //   from: 'forkreadpost@forkread.com',
    //   //The email to contact
    //   to: req.body.email.toString(),
    //   //Subject and text data  
    //   subject: 'OTP for first time verification by email',
    //   html: 'please use this number to verify your email id'
    // }
    // mailgun.messages().send(data, function (err, body) {
    //   if (err) {
    //     res.staus(500).json({
    //       'error': err
    //     })
    //   } else {
    //     return res.status(201).json({
    //       'success': 'otp has been sent to your registered email id'
    //     })
    //   }
    // })

  },
  verify: function (req, res) {
    Otp.findOne({
      'number': req.body.number
    }, function (err, obj) {
      if (err) {
        return helpers.handleError(res, err);
      }

      res.status(201).json({
        'isVerified': obj && obj.otp == req.body.otp
      });

    })
  }
}

module.exports = controller;