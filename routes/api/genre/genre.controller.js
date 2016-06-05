var
  Genre       = require('./genre.model'),
  changeCase  = require('change-case'),
  _           = require('lodash'),
  helpers     = require('../helpers');

var controller = {

  get: function (req, res) {
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
        return res.status(200).json(genre);
      } else {
        Genre.create(req.body, function (err, gen) {
          if (err) {
            return helpers.handleError(res, err);
          }
          
          return res.status(201).json(gen);
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

      genre = _.extend(genre, req.body);

      genre.save();
      return res.status(200).json(genre);

    });
  }
}

module.exports = controller;