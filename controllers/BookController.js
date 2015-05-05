var
    express = require('express'),
    mongoose = require("mongoose"),
    async = require('async'),
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

            var ownedBooks = user.books;

            if (user) {
                async.each(books,
                    // 2nd param is the function that each item is passed to
                    function (bookItem, next) {
                        BookModel.findOne({
                            'isbn': bookItem.isbn
                        }, function (err, book) {
                            if (err) {
                                return console.error(err);
                            }

                            if (book) {
                                if (!(ownedBooks.indexOf(book._id) > -1)) {
                                    ownedBooks.push(book._id);
                                    user.update({
                                        books: ownedBooks
                                    }, function (err, user) {
                                        if (err) {
                                            return console.error(err)
                                        }
                                        next();
                                    });
                                }
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
                                    if (err) {
                                        return console.error(err);
                                    }

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
                                        ownedBooks.push(newBook._id);
                                        user.update({
                                            'books': ownedBooks
                                        }, function (err, user) {
                                            if (err) {
                                                return console.error(err)
                                            }
                                            callback();
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