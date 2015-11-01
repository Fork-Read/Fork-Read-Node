var
    gcm = require('node-gcm'),
    async = require('async'),
    _ = require('underscore'),
    User = require('./user.model'),
    // DeviceModel = require('../../../models/DeviceModel'),
    // MessageModel = require('../../../models/MessageModel'),
    helpers = require('../helpers');

var controller = {

    me: function (req, res) {
        return res.status(200).json(req.user);
    },
    create: function (req, res) {
        User.findOne({
            'email': req.body.email
        }, function (err, usr) {
            if (err) {
                return helpers.handleError(res, err);
            }

            if (usr) {
                return res.status(201).json({
                    'accessToken': usr.accessToken
                });
            } else {
                User.create(req.body, function (err, user) {
                    if (err) {
                        return helpers.handleError(res, err);
                    }
                    return res.status(201).json({
                        'accessToken': user.accessToken
                    });
                });
            }
        });
    },
    // sendMessage: function (senderID, receiverID, message, callback) {
    //     var messageData = new gcm.Message(),
    //         sender = gcm.Sender('AIzaSyARi8rrbEO7Exv3WlB2ozDbKxGViR8uBRo');

    //     User.findOne({
    //         '_id': senderID
    //     }, function (err, user) {
    //         if (err) {
    //             return console.error(err);
    //         }

    //         if (user) {
    //             User.findOne({
    //                 '_id': receiverID
    //             }, function (err, targetUser) {
    //                 if (err) {
    //                     return console.error(err);
    //                 }

    //                 if (targetUser) {

    //                     messageData.addDate({
    //                         'from': {
    //                             'name': user.name,
    //                             'id': user._id,
    //                             'pictureUrl': user.pictureUrl
    //                         },
    //                         'message': 'New message received',
    //                         'to': {
    //                             'name': targetUser.name,
    //                             'id': targetUser._id,
    //                             'pictureUrl': targetUser.pictureUrl
    //                         }
    //                     });

    //                     DeviceModel.find({
    //                         user_id: targetUser._id
    //                     }, function (err, devices) {
    //                         if (err) return console.error(err);
    //                         if (devices.length) {

    //                             controller.saveUserMessage(user._id, targetUser._id, message, devices);

    //                             sender.send(messageData, devices, function (err, result) {
    //                                 if (err) {
    //                                     console.error(err);
    //                                 } else {
    //                                     callback(true);
    //                                 }
    //                             });
    //                         } else {
    //                             callback(false);
    //                         }
    //                     });
    //                 } else {
    //                     callback(false);
    //                 }

    //             });
    //         }
    //     });
    // },
    // saveUserMessage: function (user_id, target_user_id, message, devices) {
    //     var newMessage = new MessageModel({
    //         'user_id': user_id,
    //         'target_user_id': target_user_id,
    //         'message': message,
    //         'device_ids': devices,
    //         'created_at': new Date()
    //     });

    //     newMessage.save(function (err) {
    //         if (err) {
    //             return console.error(err);
    //         }
    //     });
    // },
    // getMessage: function (user_id, device_id, callback) {
    //     var returnObj = [];

    //     MessageModel.find({
    //         'user_id': user_id
    //     }, function (err, messages) {
    //         if (err) {
    //             return console.error(err);
    //         }

    //         async(messages, function (messageItem, next) {
    //             returnObj.push({
    //                 'target_user_id': messageItem.target_user_id,
    //                 'message': messageItem.messge
    //             });

    //             var devices = _.filter(messageItem.device_ids, function (item) {
    //                 return item !== device_id;
    //             });

    //             if (devices.length) {
    //                 // Update Attached device IDS
    //                 MessageModel.findOneAndUpdate({
    //                     '_id': messageItem._id
    //                 }, {
    //                     'device_ids': devices
    //                 }, function (err) {
    //                     if (err) {
    //                         return console.error(err);
    //                     }

    //                     next();
    //                 });
    //             } else {
    //                 // Remove the message as delivered to all
    //                 MessageModel.remove({
    //                     '_id': messageItem._id
    //                 }, next);
    //             }

    //         }, function (err) {
    //             callback(returnObj);
    //             return;
    //         });

    //     });
    // }
}

module.exports = controller;