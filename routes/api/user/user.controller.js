var
  gcm = require('node-gcm'),
  async = require('async'),
  _ = require('underscore'),
  User = require('./user.model'),
  helpers = require('../helpers');

var controller = {

  get: function (req, res) {
    User.findOne({
      'number': number
    }, function (err, user) {
      if (err) {
        return helpers.handleError(res,err);
      }
      res.status(200).json(user);
    })
  },
  create: function (req, res) {
    User.findOne({
      'number': req.body.number
    }, function (err, usr) {
      if (err) {
        return helpers.handleError(res, err);
      }

      if (usr) {
        return res.status(201).json({
          'already_registered': true
        });
      } else {
        User.create(req.body, function (err, user) {
          if (err) {
            return helpers.handleError(res, err);
          }
          return res.status(201).json({
            'accessToken': user.accessToken
          });
        });
      }
    });
  }
}

module.exports = controller;