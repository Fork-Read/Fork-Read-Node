var
    express = require('express'),
    mongoose = require("mongoose"),
    async = require('async'),
    UserModel = require('../models/UserModel'),
    UserBookModel = require('../models/UserBookModel'),
    BookModel = require('../models/BookModel');

var BookController = {
    getUserBooks: function (user, callback) {
        var returnObj = [];

        UserBookModel.find({
            'user_id': user,
            'isOwner': true
        }, function (err, books) {
            if (err) {
                return console.error(err);
            }

            if (user) {
                async.each(books,
                    // 2nd param is the function that each item is passed to
                    function (bookItem, next) {
                        BookModel.findOne({
                            '_id': bookItem.book_id
                        }, function (err, book) {
                            if (err) return console.error(err);

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
    },
    addToOwnList: function (user, books, elasticClient, callback) {

        /*
                Expected Object Structure
                {
                  "user": "5490787185864eb1119845f7",
                  "books": [
                    {
                      "isbn": "123456",
                      "title": "Lord of the Rings",
                      "authors": [
                        "J. R. R. Tolkien",
                        "Prateek Agarwal"
                      ],
                      "genre": [
                        "Fiction",
                        "Thriller"
                      ],
                      "publishers": "My Publishing House",
                      "publishedDate": "12-1-2014",
                      "thumbnail": "http://www.google.com",
                      "description":""
                    },
                    {
                      "isbn": "1234567889",
                      "title": "Game of Thrones",
                      "authors": [
                        "George R. R. Martin",
                        "Prateek Agarwal"
                      ],
                      "genre": [
                        "Fiction",
                        "Thriller"
                      ],
                      "publishers": "My Publishing House",
                      "publishedDate": "12-2-2014",
                      "thumbnail": "http://www.gmail.com",
                      "description":""
                    }
                  ]
                }
            */

        UserModel.findOne({
            '_id': user
        }, function (err, user) {
            if (err) {
                return console.error(err);
            }

            if (user) {
                async.each(books,
                    // 2nd param is the function that each item is passed to
                    function (bookItem, next) {
                        BookModel.findOne({
                            'isbn': bookItem.isbn
                        }, function (err, book) {
                            if (err) return console.error(err);

                            if (book) {
                                UserBookModel.findOne({
                                    'user_id': user._id,
                                    'book_id': book._id
                                }, function (err, userBook) {
                                    if (err) return console.error(err);

                                    if (userBook) {
                                        next();
                                    } else {
                                        var newUserBook = new UserBookModel({
                                            user_id: user._id,
                                            book_id: book._id,
                                            isOwner: true,
                                            hasLiked: false,
                                            isWished: false
                                        });

                                        newUserBook.save(function (err, newUserBook) {
                                            if (err) return console.error(err);
                                            next();
                                        });
                                    }
                                });
                            } else {
                                var newBook = new BookModel({
                                    isbn: bookItem.isbn,
                                    title: bookItem.title,
                                    authors: bookItem.authors,
                                    genre: bookItem.genre,
                                    publishers: bookItem.publishers,
                                    publishedDate: bookItem.publishedDate,
                                    thumbnail: bookItem.thumbnail,
                                    description: bookItem.description
                                });

                                newBook.save(function (err, newBook) {
                                    if (err) return console.error(err);

                                    // Index Book Details
                                    elasticClient.index({
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
                                        UserBookModel.findOne({
                                            'user_id': user._id,
                                            'book_id': newBook._id
                                        }, function (err, userBook) {
                                            if (err) return console.error(err);

                                            if (userBook) {
                                                next();
                                            } else {
                                                var newUserBook = new UserBookModel({
                                                    user_id: user._id,
                                                    book_id: newBook._id,
                                                    isOwner: true,
                                                    hasLiked: false,
                                                    isWished: false
                                                });

                                                newUserBook.save(function (err, newUserBook) {
                                                    if (err) return console.error(err);
                                                    next();
                                                });
                                            }
                                        });
                                    });
                                });
                            }
                        });
                    },
                    // 3rd param is the function to call when everything's done
                    function (err) {
                        // All tasks are done now
                        callback({});
                    }
                );
            } else {
                callback({});
            }
        });
    }
}

module.exports = BookController;