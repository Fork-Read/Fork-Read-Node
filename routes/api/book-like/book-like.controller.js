var
    async = require('async'),
    BookLike = require('./book-like.model'),
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

        BookLike.find({
            'user_id': user_id
        }, function (err, books_liked) {
            if (err) {
                helpers.handleError(res, err);
            }

            async.each(books_liked, function (liked_obj, next) {
                Book.findOne({
                    '_id': liked_obj.book_id
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
            BookLike.findOne({
                'book_id': req.params.id,
                'user_id': req.user._id
            }, function (err, likeObj) {
                if (err) {
                    helpers.handleError(res, err);
                }

                if (likeObj) {
                    res.status(201).json(likeObj);
                } else {
                    BookLike.create({
                        'book_id': req.params.id,
                        'user_id': req.user._id
                    }, function (err, book_like) {
                        if (err) {
                            helpers.handleError(res, err);
                        }

                        res.status(201).json(book_like);
                    });
                }
            })
        } else {
            helpers.missingParams(res);
        }
    },
    remove: function (req, res) {
        BookLike.findOne({
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