var
    gcm = require('node-gcm'),
    async = require('async'),
    _ = require('underscore'),
    Book = require('./book.model'),
    helpers = require('../helpers');

var controller = {
    save: function (req, res) {
        Book.findOne({
            'isbn': req.body.isbn
        }, function (err, book) {
            if (err) {
                return helpers.handleError(res, err);
            }

            if (book) {
                return res.status(201).json(book);
            } else {
                Book.create(req.body, function (err, newBook) {
                    if (err) {
                        return helpers.handleError(res, err);
                    }

                    req.elasticClient.index({
                        index: 'forkread',
                        type: 'books',
                        id: newBook._id + '',
                        body: {
                            _id: newBook._id,
                            isbn: newBook.isbn,
                            title: newBook.title,
                            authors: newBook.authors,
                            genre: newBook.genre,
                            publishers: newBook.publishers,
                            publishedDate: newBook.publishedDate,
                            thumbnail: newBook.thumbnail,
                            description: newBook.description
                        }
                    }, function (err, resp) {
                        if (err) {
                            return helpers.handleError(res, err);
                        }

                        return res.status(201).json(newBook);
                    });
                })
            }
        })
    }
}

module.exports = controller;