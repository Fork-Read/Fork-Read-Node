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
    }
}

module.exports = UserController;