var
  Genre       = require('./genre.model'),
  changeCase  = require('change-case'),
  _           = require('lodash'),
  helpers     = require('../helpers');

var controller = {

  getAll: function (req, res) {
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

    Genre.paginate({}, __paginatePayload).then(function(results){
      let __results = Object.assign({}, results , {
        genres: results.docs
      });

      delete __results.docs;

      res.status(200).send(__results);
    }, function(err){

    });
  },

  getById: function (req, res) {
    let genreId = req.params.id;

    if(!genreId){
      return helpers.badRequest(res, 'Invalid genre id provided');
    }

    Genre.findOne({
      '_id': req.params.id
    }).exec(function (err, genre) {

      if(err) {
        return helpers.handleError(res, err);
      }

      res.status(200).json(genre);
    });
  },

  create: function (req, res) {

    // Change case for name matching
    req.body.name = changeCase.titleCase(req.body.name);

    Genre.findOne({
      'name': req.body.name
    }).exec(function (err, genre) {

      if (err) {
        return helpers.handleError(res, err);
      }

      if (genre) {

        return helpers.badRequest(res, 'Duplicate Genre');

      } else {
        
        Genre.create(req.body).exec(function (err, gen) {
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
    }).exec(function(err, genre){

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