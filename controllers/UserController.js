var
    express = require('express'),
    gcm = require('node-gcm'),
    UserModel = require('../models/UserModel'),
    LocationModel = require('../models/LocationModel'),
    DeviceModel = require('../models/DeviceModel');

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
            "position":{
                "latitude": "12312",
                "longitude": "23234234"
            },
            "address":{
                "location": "E-808",
                "street": "taverekere",
                "city":"Bangalore",
                "state":"Karnataka",
                "country":"India",
                "zipcode": "560029",
                "formatted_address":"E-808, Bangalore, Karnataka"
            },
            device: "<device ID>"
        }*/

        UserModel.findOne({
            email: data.email
        }, function (err, user) {

            if (err) {
                return console.error(err);
            }

            if (user) {
                callback(user);
                DeviceModel.findOne({
                    'user_id': user._id,
                    'device': data.device
                }, function (err, device) {
                    if (err) return console.error(err);

                    if (!device) {
                        var newDevice = new DeviceModel({
                            user_id: user._id,
                            device: data.device
                        });

                        newDevice.save(function (err, newDevice) {
                            if (err) return console.error(err);
                            callback(user);
                            return;
                        });
                    } else {
                        callback(user);
                    }
                });
                return;
            } else {
                var newUser = new UserModel({
                    name: data.name,
                    email: data.email,
                    pictureUrl: data.pictureUrl,
                    contactNo: data.contactNo,
                    gender: data.gender,
                    isActive: true
                });

                newUser.save(function (err, newUser) {
                    if (err) {
                        return console.error(err);
                    }

                    var homeLocation = new LocationModel({
                        user_id: newUser._id,
                        position: data.position,
                        address: data.address,
                        isHome: true
                    });

                    homeLocation.save(function (err, home) {
                        if (err) return console.error(err);
                        var newDevice = new DeviceModel({
                            user_id: newUser._id,
                            device: data.device
                        });

                        newDevice.save(function (err, newDevice) {
                            if (err) return console.error(err);
                            callback(newUser);
                            return;
                        });
                    });
                });
            }
        });
    },
    updateHomeLocation: function (user, location, callback) {
        LocationModel.findOneAndUpdate({
            user_id: user,
            isHome: true
        }, {
            position: location.position,
            address: location.address
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

                    DeviceModel.find({
                        user_id: targetUser._id
                    }, function (err, devices) {
                        if (err) return console.error(err);
                        if (devices.length) {
                            sender.send(message, devices, function (err, result) {
                                if (err) {
                                    console.error(err);
                                } else {
                                    callback(true);
                                }
                            });
                        } else {
                            callback(false);
                        }
                    });
                } else {
                    callback(false);
                }

            });
        });
    }
}

module.exports = UserController;