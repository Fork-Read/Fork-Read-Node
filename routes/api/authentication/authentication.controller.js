var
  validator         = require('validator')
  User              = require('./../user/user.model'),
  Otp               = require('./otp.model'),
  helpers           = require('../helpers'),
  Message           = require('./../../../utility/message');

const OTP_TEXT = 'OTP for phone number verification on ForkRead is ';

var controller = {

  otp_send: function (req, res) {

    let number = req.body.number;

    if(!number || !validator.isMobilePhone(number, 'en-IN')){
      return helpers.badRequest(res, 'Please provide a valid number');
    }

    Otp.findOne({number}).then(function (otpObj) {
      let otp = Math.floor(Math.random() * 900000) + 100000;

      if (!otpObj) {

        // Add OTP to server
        Otp.create({number, otp}).then(function (obj) {
          Message.sendOTP({
            'number' : number,
            'country': '91',
            'message': OTP_TEXT + otp
          }, function(error, response, body){
            if(error) {
              return helpers.handleError(res, error);
            }

            res.status(200).send({});
          })

        });

      } else {

        Otp.update({number}, {otp}).then(function (obj) {
          Message.sendOTP({
            'number': number,
            'country': '91',
            'message': OTP_TEXT + otp
          }, function(error, response, body){
            if(error) {
              return helpers.handleError(res, error);
            }
            res.status(200).send({});
          });
        });
      }
    })
  },

  otp_resend: function (req, res) {
    let __payload;

    __payload = {
      number: req.body.number
    };

    if(!__payload.number || !validator.isMobilePhone(__payload.number, 'en-IN')){
      return helpers.badRequest(res, 'Please provide a valid number');
    }

    Otp.findOne(__payload).then(function(obj){
      if(obj){
        Message.sendOTP({
          'number': __payload.number,
          'country': '91',
          'message': OTP_TEXT + obj.otp
        }, function(error, response, body){
          if(error) {
            return helpers.handleError(res, error);
          } else {
            res.status(200).json({
              otp_resend: true
            });
          }
        });
      } else {
        return helpers.badRequest(res, 'OTP not present for this number');
      }
    });
  },

  otp_verify: function (req, res) {
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


    Otp.findOne(__payload).then(function(obj){
      if(obj){

        if(obj.otp === req.body.otp){
          User.findOne({
            'number': __payload.number
          }).then(function(user){
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