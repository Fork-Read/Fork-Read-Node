var
  User = require('./../user/user.model'),
  Otp = require('./otp.model'),
  request = require('request'),
  helpers = require('../helpers');

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

          var message = 'OTP for phone number verification on ForkRead: ' + otp;

          request
            .get('https://control.msg91.com/api/sendhttp.php?authkey=106754AQHXQTHpCFK56e0ec22&mobiles=91'+ number +'&message=' + message + '&sender=VERIFY&route=4&country=91')
            .on('response', function(response){
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

          var message = 'OTP for phone number verification on ForkRead: ' + otp;

          request
            .get('https://control.msg91.com/api/sendhttp.php?authkey=106754AQHXQTHpCFK56e0ec22&mobiles=91'+ number +'&message=' + message + '&sender=VERIFY&route=4&country=91')
            .on('response', function(response){
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

        var message = 'OTP for phone number verification on ForkRead: ' + obj.otp;

        request
          .get('https://control.msg91.com/api/sendhttp.php?authkey=106754AQHXQTHpCFK56e0ec22&mobiles=91'+ req.body.number +'&message=' + message + '&sender=VERIFY&route=4&country=91')
          .on('response', function(response){
            res.status(200).json({});
            return;
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

          var message = 'OTP for phone number verification on ForkRead: ' + otp;

          request
            .get('https://control.msg91.com/api/sendhttp.php?authkey=106754AQHXQTHpCFK56e0ec22&mobiles=91'+ req.body.number +'&message=' + message + '&sender=VERIFY&route=4&country=91')
            .on('response', function(response){
              res.status(200).json({});
              return;
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
        User.findOne({
          'number': req.body.number
        }, function(err, user){
          if(err) {
            return helpers.handleError(res, err);
          }

          if(user){
            user.save();
            delete user.salt;
            res.status(200).json(user);
          }
        });
      } else {
        res.status(200).json({
          'verified': false
        });
      }
    })
  }
}

module.exports = controller;