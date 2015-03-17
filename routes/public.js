var
    express = require('express'),
    router = express.Router(),
    async = require('async'),
    UserModel = require('../models/UserModel'),
    BookModel = require('../models/BookModel');

router.get('/books/:email', function (req, res) {

    var email = req.param('email');

    var ownedBooks = [];

    if (email) {
        UserModel.findOne({
            'email': email
        }, function (err, user) {
            if (err) {
                return console.error(err);
            }

            if (user) {
                // 1st para in async.each() is the array of items
                async.each(user.books,
                    // 2nd param is the function that each item is passed to
                    function (bookItem, callback) {
                        BookModel.findOne({
                            '_id': bookItem
                        }, function (err, book) {
                            if (err) {
                                return console.error(err);
                            }

                            if (book) {
                                ownedBooks.push(book);
                                callback();
                            }
                        });
                    },
                    // 3rd param is the function to call when everything's done
                    function (err) {
                        // All tasks are done now
                        res.render('owned-books', {
                            user: user,
                            books: ownedBooks
                        });
                    }
                );
            } else {
                res.render('owned-books', {});
            }
        });
    } else {
        res.render('owned-books', {});
    }
});

module.exports = router;