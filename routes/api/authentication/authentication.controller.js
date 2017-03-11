var
  validator         = require('validator')
  User              = require('./../user/user.model'),
  Otp               = require('./otp.model'),
  helpers           = require('../helpers'),
  Message           = require('./../../../utility/message');

const OTP_TEXT = 'OTP for phone number verification on ForkRead is ';

var controller = {

  otp: function (req, res) {

    let number = req.body.number;

    Otp.findOne({
      'number': number
    }, function (err, otpObj) {
      if (err) {
        return false;
      }

      var generated_otp = Math.floor(Math.random() * 900000) + 100000;
      if (!otpObj) {

        // Add OTP to server
        Otp.create({
          'number': number,
          'otp': generated_otp
        }, function (err, obj) {
          if (err) {
            return false;
          }

          Message.sendOTP({
            'number' : number,
            'country': '91',
            'message': OTP_TEXT + generated_otp
          }, function(error, response, body){
            if(error) {
                console.log(error);
            }

            res.status(200).send({});
          })

        });

      } else {

        Otp.update({
          'number': number
        }, {
          'otp': generated_otp
        }, function (err, obj) {
          if(err) {
            return helpers.handleError(res, err);
          }

          Message.sendOTP({
            'number': number,
            'country': '91',
            'message': OTP_TEXT + generated_otp
          }, function(error, response, body){
            if(error) {
                console.log(error);
            }
            res.status(200).send({});
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
        var generated_otp = Math.floor(Math.random() * 90000) + 10000;

        // Add OTP to server
        Otp.create({
          'number': req.body.number,
          'otp': generated_otp
        }, function (err, obj) {
          if (err) {
            return helpers.handleError(res, err);
          }

          Message.sendOTP({
            'number': req.body.number,
            'country': '91',
            'message': OTP_TEXT + generated_otp
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
    let __payload;

    __payload = {
      number: req.body.number
    };

    if(!__payload.number || !validator.isMobilePhone(__payload.number, 'en-IN')){
      return helpers.badRequest(res, 'Please provide a valid number');
    }

    if(!req.body.otp){
      return helpers.badRequest(res, 'Please provide a valid OTP');
    }


    Otp.findOne(__payload, function(err, obj){
      if(err){
        return helpers.handleError(res, err);
      }

      if(obj){

        if(obj.otp === req.body.otp){
          User.findOne({
            'number': __payload.number
          }, function(err, user){
            if(err) {
              return helpers.handleError(res, err);
            }

            if(user){
              user.isNumberVerified = true;
              user.save();
              res.status(200).json({
                message: 'OTP Verified'
              });
            } else {
              return helpers.badRequest(res, 'Could not find user with this number');
            }
          });
        } else {
          return helpers.badRequest(res, 'Incorrect OTP entered');
        }
      } else {
        return helpers.badRequest(res, 'OTP not sent for this input');
      }
    });
  }
};

module.exports = controller;