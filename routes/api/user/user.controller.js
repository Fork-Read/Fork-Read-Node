var
  async = require('async'),
  User = require('./user.model'),
  helpers = require('../helpers'),
  authenticationController = require('../authentication/authentication.controller');

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

        authenticationController.otp(user.number);

        delete user.salt;
        delete user._id;
        delete user.number;
        delete user.email;

        res.status(200).json(user);
      } else {
        res.status(200).json({
          'is_registered': false
        });
      }
    })
  },
  create: function (req, res) {

    // Delete isVerified and active key if present in request
    delete req.body.isVerified;
    delete req.body.active;

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

          authenticationController.otp(user.number);
          
          return res.status(201).json({
            'already_registered': false
          });
        });
      }
    });
  },
  update: function (req, res) {
    if (req.user._id == res.body._id) {
      
      // req.user is the present state of the user object
      req.body = _.merge(req.user, req.body);

      User.update({
        '_id': req.user._id
      }, req.body, function (err, user) {
        if(err) {
          return helpers.handleError(res, err);
        }

        res.status(201).json(user);
      })
    } else {
      return helpers.permissionDenied(res);
    }
  }
}

module.exports = controller;