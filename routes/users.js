var 
	express = require('express'),
	router = express.Router(),
	UserModel = require('../models/UserModel');

router.get('/:email', function(req, res) {
	var email = req.param('email');

	if(email) {
		UserModel.findOne({'email': email}, function(err, user) {
			if(err) {
				return console.error(err);
			}
			if(user){
				res.set('Content-Type', 'application/json');
				res.send(JSON.stringify(user));
			}
			else{
				res.set('Content-Type', 'application/json');
				res.send(JSON.stringify({}));
			}
		});
	}
	else{
		res.redirect('/noResult');
	}
});

router.post('/save', function(req, res) {

	/*
	Expected Object Structure
	{
	  "name": "Prateek Agarwal",
	  "email": "prateekagr98@gmail.com",
	  "contactNo": "8861986656",
	  "gender": "Male",
	  "currentLocation": {
	    "position": {
	      "latitude": "123456",
	      "longitude": "654321"
	    },
	    "address": {
	      "location": "E-808, Appt",
	      "street": "Taverkere Main Road",
	      "city": "Bangalore",
	      "state": "Karnataka",
	      "country": "India",
	      "zipCode": "560029",
	      "formatted_address": "E-808, Appt, taverkere, bangalore, india"
	    }
	    
	  },
	  "books": [],
	  "searchedLocations": []
	}*/

	var email = req.body.email;

	if(email) {
		UserModel.findOne({email: email}, function(err, user) {

			if(err) {
				return console.error(err);
			}

			if(user) {
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
					searchedLocations: [],  // No Searched Locations will be added when user entry is created
					isActive: true
				});

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
	else {
		res.redirect('/noResult');
	}
});

router.post('/addSearchLocation', function(req, res) {
	var userId = req.body.user;
	var latitude = req.body.latitude;
	var longitude = req.body.longitude;

	if(userId && latitude && longitude) {
		var newLocation = {
			longitude: req.body.longitude,
			latitude : req.body.latitude
		}

		UserModel.findOne({"_id": userId}, function(err, user) {
			if(err) {
				return console.error(err);
			}

			var finalLocations = user.searchedLocations;
			var isNewLocation = true;
			finalLocations.forEach(function(item) {
				if(item.latitude == newLocation.latitude && item.longitude == newLocation.longitude) {
					isNewLocation = false;
				}
			});
			
			if(isNewLocation) {
				finalLocations.push(newLocation);
			}

			UserModel.findOneAndUpdate({"_id": userId}, {searchedLocations: finalLocations}, function(err, user) {
				if(err) {
					return console.error(err)
				}
				res.set('Content-Type', 'application/json');
				res.send(JSON.stringify(user));
			});
		});

	}
	else{
		res.redirect('/noResult');
	}
});

router.post('/update', function(req, res) {
	var email = req.body.email;

	if(email) {
		UserModel.findOneAndUpdate({email: email}, {currentLocation: req.body.currentLocation}, function(err, user) {
			if(err) {
				return console.error(err);
			}

			res.set('Content-Type', 'application/json');
			res.send(JSON.stringify(user));
			
		});
	}
	else{
		res.redirect('/noResult');
	}
});

module.exports = router;
