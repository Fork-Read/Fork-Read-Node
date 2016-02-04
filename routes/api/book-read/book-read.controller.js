var
    async = require('async'),
    BookRead = require('./book-read.model'),
    Book = require('../books/book.model'),
    helpers = require('../helpers');

var controller = {
    get: function (req, res) {
        var user_id;
        if (req.params.id) {
            user_id = req.params.id;
        } else {
            user_id = req.user.id;
        }

        var returnObj = {
            'books': []
        }

        BookRead.find({
            'user_id': user_id
        }, function (err, books_owned) {
            if (err) {
                helpers.handleError(res, err);
            }

            async.each(books_owned, function (owned_obj, next) {
                Book.findOne({
                    '_id': owned_obj.book_id
                }, function (err, book) {
                    if (err) {
                        helpers.handleError(res, err);
                    }

                    if (book) {
                        returnObj.books.push(book);
                        next();
                    } else {
                        next();
                    }
                })
            }, function (err) {
                if (err) {
                    helpers.handleError(res, err);
                }
                res.status(201).json(returnObj);
            })
        })
    },
    add: function (req, res) {
        if (req.params.id) {
            BookRead.findOne({
                'book_id': req.params.id,
                'user_id': req.user._id
            }, function (err, ownObj) {
                if (err) {
                    helpers.handleError(res, err);
                }

                if (ownObj) {
                    res.status(201).json(ownObj);
                } else {
                    BookRead.create({
                        'book_id': req.params.id,
                        'user_id': req.user._id
                    }, function (err, book_own) {
                        if (err) {
                            helpers.handleError(res, err);
                        }

                        res.status(201).json(book_own);
                    });
                }
            })
        } else {
            helpers.missingParams(res);
        }
    },
    remove: function (req, res) {
        BookRead.findOne({
            'book_id': req.params.id,
            'user_id': req.user._id
        }, function (err, model) {
            if (err) {
                helpers.handleError(res, err);
            }
            if (model) {
                model.remove(function (err, obj) {
                    if (err) {
                        helpers.handleError(res, err);
                    }

                    res.status(201).json(obj);
                })
            } else {
                helpers.permissionDenied(res);
            }
        })
    }
}

module.exports = controller;