var
  User    = require('./../user/user.model'),
  Otp     = require('./otp.model'),
  helpers = require('../helpers'),
  Message = require('./../../../utility/message');

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

      var generated_otp = Math.floor(Math.random() * 90000) + 10000;
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
};

module.exports = controller;