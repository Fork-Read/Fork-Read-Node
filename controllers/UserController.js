var
    express = require('express'),
    gcm = require('node-gcm'),
    async = require('async'),
    _ = require('underscore'),
    UserModel = require('../models/UserModel'),
    DeviceModel = require('../models/DeviceModel'),
    MessageModel = require('../models/MessageModel');

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
    sendMessage: function (senderID, receiverID, message, callback) {
        var messageData = new gcm.Message(),
            sender = gcm.Sender('AIzaSyARi8rrbEO7Exv3WlB2ozDbKxGViR8uBRo');

        UserModel.findOne({
            '_id': senderID
        }, function (err, user) {
            if (err) {
                return console.error(err);
            }

            if (user) {
                UserModel.findOne({
                    '_id': receiverID
                }, function (err, targetUser) {
                    if (err) {
                        return console.error(err);
                    }

                    if (targetUser) {

                        messageData.addDate({
                            'from': {
                                'name': user.name,
                                'id': user._id,
                                'pictureUrl': user.pictureUrl
                            },
                            'message': 'New message received',
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

                                UserController.saveUserMessage(user._id, targetUser._id, message, devices);

                                sender.send(messageData, devices, function (err, result) {
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
            }
        });
    },
    saveUserMessage: function (user_id, target_user_id, message, devices) {
        var newMessage = new MessageModel({
            'user_id': user_id,
            'target_user_id': target_user_id,
            'message': message,
            'device_ids': devices,
            'created_at': new Date()
        });

        newMessage.save(function (err) {
            if (err) {
                return console.error(err);
            }
        });
    },
    getMessage: function (user_id, device_id, callback) {
        var returnObj = [];

        MessageModel.find({
            'user_id': user_id
        }, function (err, messages) {
            if (err) {
                return console.error(err);
            }

            async(messages, function (messageItem, next) {
                returnObj.push({
                    'target_user_id': messageItem.target_user_id,
                    'message': messageItem.messge
                });

                var devices = _.filter(messageItem.device_ids, function (item) {
                    return item !== device_id;
                });

                if (devices.length) {
                    // Update Attached device IDS
                    MessageModel.findOneAndUpdate({
                        '_id': messageItem._id
                    }, {
                        'device_ids': devices
                    }, function (err) {
                        if (err) {
                            return console.error(err);
                        }

                        next();
                    });
                } else {
                    // Remove the message as delivered to all
                    MessageModel.remove({
                        '_id': messageItem._id
                    }, next);
                }

            }, function (err) {
                callback(returnObj);
                return;
            });

        });
    }
}

module.exports = UserController;