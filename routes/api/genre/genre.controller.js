var
  Genre       = require('./genre.model'),
  changeCase  = require('change-case'),
  _           = require('lodash'),
  helpers     = require('../helpers');

var controller = {

  getAll: function (req, res) {
    Genre.find({}, function(err, genres) {
      if(err) {
        return helpers.handleError(res, err);
      }

      res.status(200).json({
        'genres': genres
      });
    });
  },

  getById: function (req, res) {
    let genreId = req.params.id;

    if(!genreId){
      return helpers.badRequest(res, 'Invalid genre id provided');
    }

    Genre.findOne({
      '_id': req.params.id
    }, function (err, genre) {
      if(err) {
        return helpers.handleError(res, err);
      }

      res.status(200).json(genre);
    })
  },

  create: function (req, res) {

    // Change case for name matching
    req.body.name = changeCase.titleCase(req.body.name);

    Genre.findOne({
      'name': req.body.name
    }, function (err, genre) {
      if (err) {
        return helpers.handleError(res, err);
      }

      if (genre) {
        return helpers.badRequest(res, 'Duplicate Genre');
      } else {
        Genre.create(req.body, function (err, gen) {
          if (err) {
            return helpers.handleError(res, err);
          }
          
          return res.status(200).json(gen);
        });
      }
    });
  },
  
  update: function (req, res) {

    Genre.findOne({
      '_id': req.params.id
    }, function(err, genre){

      if(err){
        return helpers.handleError(res, err);
      }

      genre = Object.assign({}, genre, req.body);

      genre.save();

      return res.status(201).json(genre);

    });
  }
}

module.exports = controller;