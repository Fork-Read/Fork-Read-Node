var
    express = require('express'),
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
    }
}

module.exports = UserController;