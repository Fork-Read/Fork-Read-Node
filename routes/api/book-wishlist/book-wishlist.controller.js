var
    async = require('async'),
    BookWishlist = require('./book-wishlist.model'),
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

        BookWishlist.find({
            'user_id': user_id
        }, function (err, books_wished) {
            if (err) {
                helpers.handleError(res, err);
            }

            async.each(books_wished, function (wished_obj, next) {
                Book.findOne({
                    '_id': wished_obj.book_id
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
            BookWishlist.findOne({
                'book_id': req.params.id,
                'user_id': req.user._id
            }, function (err, wishObj) {
                if (err) {
                    helpers.handleError(res, err);
                }

                if (wishObj) {
                    res.status(201).json(wishObj);
                } else {
                    BookWishlist.create({
                        'book_id': req.params.id,
                        'user_id': req.user._id
                    }, function (err, book_wish) {
                        if (err) {
                            helpers.handleError(res, err);
                        }

                        res.status(201).json(book_wish);
                    });
                }
            })
        } else {
            helpers.missingParams(res);
        }
    },
    remove: function (req, res) {
        BookWishlist.findOne({
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