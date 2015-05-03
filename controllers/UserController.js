var
    express = require('express'),
    gcm = require('node-gcm'),
    UserModel = require('../models/UserModel');

var UserController = {

    getUserByEmail: function (email, callback) {
        UserModel.findOne({
            'email': email
        }, function (err, user) {
            if (err) {
                return console.error(err);
            }
            callback(user);
        });
    },
    getUserById: function (id, callback) {
        UserModel.findOne({
            '_id': id
        }, function (err, user) {
            if (err) {
                return console.error(err);
            }
            callback(user);
        });
    },
    save: function (data, callback) {
        /*
        Expected Object Structure {
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

        UserModel.findOne({
            email: data.email
        }, function (err, user) {

            if (err) {
                return console.error(err);
            }

            if (user) {
                if (!user.devices) {
                    user.devices = [];
                }
                // Add Device ID if not already present
                if (user.devices.indexOf(req.body.device) === -1) {
                    user.devices.push(req.body.devices);
                    UserModel.findOneAndUpdate({
                        email: data.email
                    }, {
                        devices: user.devices
                    }, function (err, user) {
                        if (err) {
                            return console.error(err);
                        }

                        callback(user);
                    });
                } else {
                    // If already present then send the user object back
                    callback(user);
                }
            } else {
                var newUser = new UserModel({
                    name: data.name,
                    email: data.email,
                    pictureUrl: data.pictureUrl,
                    contactNo: data.contactNo,
                    gender: data.gender,
                    currentLocation: data.currentLocation,
                    books: [], // No Books will be added to owned list when user entry is created,
                    searchHistory: [], // No Searched Locations will be added when user entry is created
                    isActive: true,
                    devices: [data.device]
                });

                newUser.save(function (err, newUser) {
                    if (err) {
                        return console.error(err);
                    }

                    callback(newUser);
                });
            }
        });
    },
    updateLocation: function (email, location, callback) {
        UserModel.findOneAndUpdate({
            email: email
        }, {
            currentLocation: location
        }, function (err, user) {
            if (err) {
                return console.error(err);
            }
            callback(user);
        });
    },
    message: function (senderID, receiverID, message, callback) {
        var message = new gcm.Message(),
            sender = gcm.Sender('AIzaSyARi8rrbEO7Exv3WlB2ozDbKxGViR8uBRo');

        UserModel.findOne({
            '_id': senderID
        }, function (err, user) {
            if (err) {
                return console.error(err);
            }

            UserModel.findOne({
                '_id': receiverID
            }, function (err, targetUser) {
                if (err) {
                    return console.error(err);
                }
                if (targetUser) {

                    message.addDate({
                        'from': {
                            'name': user.name,
                            'id': user._id,
                            'pictureUrl': user.pictureUrl
                        },
                        'message': message,
                        'to': {
                            'name': targetUser.name,
                            'id': targetUser._id,
                            'pictureUrl': targetUser.pictureUrl
                        }
                    });

                    if (targetUser.devices.length) {
                        sender.send(message, targetUser.devices, function (err, result) {
                            if (err) {
                                console.error(err);
                            } else {
                                callback(true);
                            }
                        });
                    } else {
                        rcallback(false);
                    }

                } else {
                    callback(false);
                }

            });
        });
    }
}

module.exports = UserController;