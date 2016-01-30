var
  gcm = require('node-gcm'),
  async = require('async'),
  _ = require('underscore'),
  User = require('./user.model'),
  helpers = require('../helpers');

var controller = {

  me: function (req, res) {
    return res.status(200).json(req.user);
  },
  create: function (req, res) {
    User.findOne({
      'contact': req.body.contact
    }, function (err, usr) {
      if (err) {
        return helpers.handleError(res, err);
      }

      if (usr) {
        return res.status(201).json({
          'accessToken': usr.accessToken
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