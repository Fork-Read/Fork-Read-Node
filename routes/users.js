var express = require('express');
var router = express.Router();
var UserModel = require('../models/UserModel');

router.get('/:email', function(req, res) {
	var email = req.param('email');

	UserModel.findOne({email: email}, function(err, user) {
		if(err) {
			return console.error(err);
		}
		res.set('Content-Type', 'application/json');
		res.send(JSON.stringify(user));
	});
});

router.post('/save', function(req, res) {

	var email = req.body.email;

	if(email) {
		UserModel.findOne({email: email}, function(err, user) {
			if(err) {
				return console.error(err);
			}

			if(user) {
				console.log('existing user');
				res.set('Content-Type', 'application/json');
				res.send(JSON.stringify(user));
			}
			else {
				var newUser = new UserModel({
					name: req.body.name,
					email: req.body.email,
					contactNo: req.body.contactNo,
					gender: req.body.gender,
					currentLocation: req.body.currentLocation,
					books: [],   // No Books will be added to owned list when user entry is created,
					searchedLocations: []  // No Searched Locations will be added when user entry is created
				});

				console.log('new user');

				newUser.save(function(err, newUser) {
					if(err) {
						return console.error(err);
					}
					res.set('Content-Type', 'application/json');
					res.send(JSON.stringify(newUser));
				});
			}
		});
	}
});

router.post('/addSearchLocation', function(req, res) {
	var user = req.body.user;
	var latitude = req.body.latitude;
	var longitude = req.body.longitude;
	console.log('route reacehd');
	if(user && latitude && longitude) {
		var newLocation = {
			longitude: req.body.longitude,
			latitude : req.body.latitude
		}

		UserModel.findOne({"_id": user}, function(err, user) {
			if(err) {
				return console.error(err);
			}

			console.log("user found");

			var finalLocations = user.searchedLocations;
			finalLocations.push(newLocation);

			user.update({searchedLocations: finalLocations}, function(err, rowsAffected) {
				if(err) {
					return console.error(err)
				}
				console.log("user updated");
				res.set('Content-Type', 'application/json');
				res.send(JSON.stringify(user));
			});
		});

	}
});

module.exports = router;
