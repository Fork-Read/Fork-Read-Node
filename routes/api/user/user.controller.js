var
  async                     = require('async'),
  _                         = require('lodash'),
  validator                 = require('validator'),
  md5                       = require('md5'),
  User                      = require('./user.model'),
  UserGenre                 = require('./user_genre.model'),
  helpers                   = require('../helpers'),
  authenticationController  = require('../authentication/authentication.controller');

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
      
      delete user.email;
      delete user.number;

      res.status(200).json(user);
    })
  },
  login: function (req, res) {
    let input = req.body.input;
    let isEmail = validator.isEmail(input);
    let isNumber = validator.isMobilePhone(input, 'en-IN');
    let passwordHash = md5(req.body.password);

    let __queryPayload = {};

    if(isEmail){
      __queryPayload.email = input;
    } else if(isNumber){
      __queryPayload.number = input;
    }

    if(!isEmail && !isNumber){
      res.status(400).send({
        msg: 'Please enter a valid email or number'
      });
    }

    User.findOne(__queryPayload, function(err, user){
      if(err){
        return helpers.handleError(res, err);
      }

      if(user){
        if(user.password === passwordHash){
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
    }, function (err, usr) {
      if (err) {
        return helpers.handleError(res, err);
      }

      if (usr) {
        return helpers.badRequest(res, 'User is already registered');
      } else {
        User.create(req.body, function (err, user) {
          if (err) {
            return helpers.handleError(res, err);
          }
          
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
      }, function(err, user){
        if(err){
          return helpers.handleError(res, err);
        }

        user = _.extend(user, req.body);
        user.save();
        res.status(200).json(user);
      });
    } else {
      return helpers.permissionDenied(res);
    }
  },
  mapGenres: function (req, res) {
    console.log('sdjhsdbf');
    async.each(req.body.genres, function(genre, next){

      UserGenre.findOne({
        'user_id': req.user.id,
        'genre_id': genre
      }, function(err, mapping){
        if(err){
          return helpers.handleError(res, err);
        }

        // If the mapping already exists then ignore
        if(mapping) {
          next();
        } else {

          UserGenre.create({
            'user_id': req.user.id,
            'genre_id': genre
          }, function(err, result){
            if(err){
              return helpers.handleError(res, err);
            }

            next();
          });
        }
      });

    }, function(err, result){
      res.status(200).json({});
    })
  }
}

module.exports = controller;