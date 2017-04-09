var
  async                     = require('async'),
  _                         = require('lodash'),
  validator                 = require('validator'),
  md5                       = require('md5'),
  User                      = require('./user.model'),
  helpers                   = require('../helpers'),
  authenticationController  = require('../authentication/authentication.controller');

var controller = {

  get: function (req, res) {

    let __paginatePayload;

    __paginatePayload = {
      limit: 10
    };

    if(req.query.limit){
      __paginatePayload.limit = parseInt(req.query.limit, 10);
    }

    if(req.query.page){
      __paginatePayload.page = parseInt(req.query.page, 10);
    } else if(req.query.offset){
      __paginatePayload.offset = parseInt(req.query.offset, 10);
    }

    User.paginate({}, __paginatePayload).then(function(results){
      let __results = Object.assign({}, results , {
        users: results.docs
      });

      delete __results.docs;

      res.status(200).send(__results);
    }, function(err){

    });
    
  },

  getById: function (req, res) {

    User.findOne({
      '_id': req.params.id
    }).then(function (user) {
    
      delete user.email;
      delete user.number;

      res.status(200).json(user);
    });
  },

  login: function (req, res) {
    let input = req.body.input;
    let isEmail = validator.isEmail(input);
    let isNumber = validator.isMobilePhone(input, 'en-IN');
    let passwordHash = md5(req.body.password.toString());

    let __queryPayload = {};

    if(isEmail){
      __queryPayload.email = input;
    } else if(isNumber){
      __queryPayload.number = input;
    }

    if(!isEmail && !isNumber){
      return helpers.badRequest(res, 'Please enter a valid email or number');
    }

    User.findOne(__queryPayload).then(function(user){
      if(user){
        if(user.password.toString() === passwordHash.toString()){
          res.status(200).send(_.omit(user, ['salt', 'password']));  
        } else {
          return helpers.badRequest(res, 'Password entered is incorrect');
        }
        
      } else {
        return helpers.badRequest(res, 'User is not registered');
      }

    });
  },

  create: function (req, res) {

    // Delete isVerified and active key if present in request
    delete req.body.isNumberVerified;
    delete req.body.isEmailVerified;

    User.findOne({
      'email': req.body.email
    }).then(function (usr) {
      
      if (usr) {
        return helpers.badRequest(res, 'User is already registered');
      } else {

        User.create(req.body).then(function (user) {
          return res.status(201).json(user);
        });

      }
    });
  },

  update: function (req, res) {
    if (req.user.id == res.body.id) {
      
      // req.user is the present state of the user object
      req.body = _.merge(req.user, req.body);

      User.findOne({
        '_id': req.user.id
      }).then(function(user){
        user = _.extend(user, req.body);
        user.save();
        res.status(200).json(user);

      });
    } else {
      return helpers.permissionDenied(res);
    }
  }
}

module.exports = controller;