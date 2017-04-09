let
	UserGenre = require('./user_genre.model'),
	_map			= require('lodash').map,
	helpers   = require('../helpers'),
	async 		= require('async');

let controller = {

	create: function(req, res){
		let genre_mappping = [];

		async.each(req.body.genre_list, function(genre, done){
			let __data = {
				genre_id: genre,
				user_id: req.user.id
			};

			UserGenre.create(__data).then(function(mapping){
				genre_mappping.push(mapping);
				done();
			}, function(err){
      	done();
    	});

		}, function(err){
			if(err){
				helpers.handleError(err, res);
			}

			res.status(201).send({
				genre_mappping
			})
		});
	}
};

module.exports = controller;