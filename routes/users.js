var
    express = require('express'),
    router = express.Router(),
    gcm = require('node-gcm'),
    UserModel = require('../models/UserModel');

router.get('/:email', function (req, res) {
    var email = req.param('email');

    if (email) {

        UserModel.findOne({
            'email': email
        }, function (err, user) {
            if (err) {
                return console.error(err);
            }
            if (user) {
                res.set('Content-Type', 'application/json');
                res.send(JSON.stringify(user));
            } else {
                res.set('Content-Type', 'application/json');
                res.send(JSON.stringify({}));
            }
        });
    } else {
        res.redirect('/noResult');
    }
});

router.post('/save', function (req, res) {

    /*
	Expected Object Structure
	{
	  "name": "Prateek Agarwal",
	  "email": "prateekagr98@gmail.com",
	  "pictureUrl": "http://www.facebook.com",
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
	  "searchHistory": []
	}*/

    var email = req.body.email;

    if (email) {
        UserModel.findOne({
            email: email
        }, function (err, user) {

            if (err) {
                return console.error(err);
            }

            if (user) {
                // Add Device ID if not already present
                if (user.devices.indexOf(req.body.device) === -1) {
                    user.devices.push(req.body.devices);
                    UserModel.findOneAndUpdate({
                        email: email
                    }, {
                        devices: user.devices
                    }, function (err, user) {
                        if (err) {
                            return console.error(err);
                        }

                        res.set('Content-Type', 'application/json');
                        res.send(JSON.stringify(user));
                    });
                } else {
                    // If already present then send the user object back
                    res.set('Content-Type', 'application/json');
                    res.send(JSON.stringify(user));
                }
            } else {
                var newUser = new UserModel({
                    name: req.body.name,
                    email: req.body.email,
                    pictureUrl: req.body.pictureUrl,
                    contactNo: req.body.contactNo,
                    gender: req.body.gender,
                    currentLocation: req.body.currentLocation,
                    books: [], // No Books will be added to owned list when user entry is created,
                    searchHistory: [], // No Searched Locations will be added when user entry is created
                    isActive: true,
                    devices: [req.body.device]
                });

                newUser.save(function (err, newUser) {
                    if (err) {
                        return console.error(err);
                    }

                    res.set('Content-Type', 'application/json');
                    res.send(JSON.stringify(newUser));
                });
            }
        });
    } else {
        res.redirect('/noResult');
    }
});

router.post('/update', function (req, res) {
    var email = req.body.email;

    if (email) {
        UserModel.findOneAndUpdate({
            email: email
        }, {
            currentLocation: req.body.currentLocation
        }, function (err, user) {
            if (err) {
                return console.error(err);
            }

            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(user));

        });
    } else {
        res.redirect('/noResult');
    }
});

router.post('/sendMessage', function (req, res) {
    var message = new gcm.Message(),
        sender = gcm.Sender('AIzaSyARi8rrbEO7Exv3WlB2ozDbKxGViR8uBRo'),
        devices = [];

    message.addDate('notification', 'This is a notification message');
});

module.exports = router;