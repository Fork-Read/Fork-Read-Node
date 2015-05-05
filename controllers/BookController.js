var
    express = require('express'),
    mongoose = require("mongoose"),
    async = require('async'),
    router = express.Router(),
    UserModel = require('../models/UserModel'),
    BookModel = require('../models/BookModel');

var BookController = {
    getUserBooks: function (user, callback) {
        var returnObj = [];

        UserModel.findOne({
            '_id': user
        }, function (err, user) {
            if (err) {
                return console.error(err);
            }

            if (user) {
                async.each(user.books,
                    // 2nd param is the function that each item is passed to
                    function (bookItem, next) {
                        BookModel.findOne({
                            '_id': bookItem
                        }, function (err, book) {
                            if (err) {
                                return console.error(err);
                            }

                            if (book) {
                                returnObj.push(book);
                                next();
                            }
                        });
                    },
                    // 3rd param is the function to call when everything's done
                    function (err) {
                        // All tasks are done now
                        callback(returnObj);
                    }
                );
            } else {
                callback(returnObj);
            }
        });
    }
}

module.exports = BookController;