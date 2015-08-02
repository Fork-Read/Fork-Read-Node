var
    express = require('express'),
    gcm = require('node-gcm'),
    UserModel = require('../models/UserModel'),
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
        Expected Object Structure 
        {
            "name": "Prateek Agarwal",
            "email": "prateekagr98@gmail.com",
            "pictureUrl": "http://www.facebook.com",
            "contactNo": "8861986656",
            "gender": "Male",
            "homeLocation":{
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
                }
            },
            "device": "<device ID>"
        }*/

        UserModel.findOne({
            email: data.email
        }, function (err, user) {

            if (err) {
                return console.error(err);
            }

            if (user) {
                DeviceModel.findOne({
                    'device_id': data.device
                }, function (err, device) {
                    if (err) return console.error(err);

                    if (!device) {
                        var newDevice = new DeviceModel({
                            user_id: user._id,
                            device_id: data.device
                        });
                        newDevice.save(function (err, newDevice) {
                            if (err) return console.error(err);
                            callback(user);
                            return;
                        });
                    } else {
                        DeviceModel.findOneAndUpdate({
                            device_id: data.device
                        }, {
                            user_id: user._id
                        }, function (err, deviceDetail) {
                            if (err) {
                                return console.error(err);
                            }
                            callback(user);
                            return;
                        });
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
                    homeLocation: data.homeLocation,
                    isActive: true
                });

                newUser.save(function (err, newuser) {
                    if (err) {
                        return console.error(err);
                    }

                    DeviceModel.findOne({
                        'device_id': data.device
                    }, function (err, device) {
                        if (err) return console.error(err);

                        if (!device) {
                            var newDevice = new DeviceModel({
                                user_id: newuser._id,
                                device_id: data.device
                            });

                            newDevice.save(function (err, newDevice) {
                                if (err) return console.error(err);
                                callback(newuser);
                                return;
                            });
                        } else {
                            DeviceModel.findOneAndUpdate({
                                device_id: data.device
                            }, {
                                user_id: newuser._id
                            }, function (err, deviceDetail) {
                                if (err) {
                                    return console.error(err);
                                }
                                callback(newuser);
                                return;
                            });
                        }
                    });
                });
            }
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