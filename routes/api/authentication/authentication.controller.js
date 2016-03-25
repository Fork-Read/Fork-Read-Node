var
  User = require('./../user/user.model'),
  Otp = require('./otp.model'),
  request = require('request'),
  helpers = require('../helpers'),
  Message = require('./../../../utility/message');

const OTP_TEXT = 'OTP for phone number verification on ForkRead is ';

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

          Message.sendOTP({
            'number' : number,
            'country': '91',
            'message': OTP_TEXT + otp
          }, function(error, response, body){
            if(error) {
                console.log(error);
            }
          })

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

          Message.sendOTP({
            'number': number,
            'country': '91',
            'message': OTP_TEXT + otp
          }, function(error, response, body){
            if(error) {
                console.log(error);
            }
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

        Message.sendOTP({
          'number': req.body.number,
          'country': '91',
          'message': OTP_TEXT + obj.otp
        }, function(error, response, body){
          if(error) {
              console.log(error);
          } else {
            res.status(200).json({});
          }
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

          Message.sendOTP({
            'number': req.body.number,
            'country': '91',
            'message': OTP_TEXT + otp
          }, function(error, response, body){
            if(error) {
                console.log(error);
            } else {
              res.status(200).json({});
            }
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
            user.verified = true;
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