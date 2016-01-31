var
  gcm = require('node-gcm'),
  async = require('async'),
  _ = require('underscore'),
  User = require('./user.model'),
  helpers = require('../helpers');

var controller = {

  get: function (req, res) {
    User.find({}, function(err, users) {
      if(err) {
        return helpers.handleError(res, err);
      }

      res.status(200).json({
        'users': users
      });
    });
  },
  getById: function (req, res) {
    User.findOne({
      '_id': req.params.id
    }, function (err, user) {
      if(err) {
        return helpers.handleError(res, err);
      }

      res.status(200).json(user);
    })
  },
  login: function (req, res) {
    User.findOne({
      'number': req.body.number
    }, function (err, user) {
      if(err) {
        return helpers.handleError(res, err);
      }

      if(user) {
        user.is_registered = true;

        res.status(200).json(user);
      } else {
        res.status(200).json({
          'is_registered': false
        });
      }
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
        return res.status(200).json({
          'already_registered': true
        });
      } else {
        User.create(req.body, function (err, user) {
          if (err) {
            return helpers.handleError(res, err);
          }

          user.already_registered = false;
          return res.status(201).json(user);
        });
      }
    });
  }
}

module.exports = controller;