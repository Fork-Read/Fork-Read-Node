var
    express = require('express'),
    router = express.Router(),
    UserModel = require('../models/UserModel'),
    BookModel = require('../models/BookModel');

router.get('/book/:user', function (req, res) {
    var user = req.param('user');

    var returnObj = [];

    if (user) {
        UserModel.findOne({
            '_id': user
        }, function (err, user) {
            if (err) {
                return console.error(err);
            }

            var i = 0;

            for (; i < user.books.length; i++) {
                BookModel.findOne({
                    '_id': user.books[i]
                }, function (err, book) {
                    if (err) {
                        return console.error(err);
                    }

                    if (book) {
                        returnObj.push(book);
                    }

                    // Return Book Data if this is the last query
                    if (i = user.books.length - 1) {
                        res.render('owned-books', {});
                    }
                });
            }
        });
    } else {
        res.redirect('/noResult');
    }
});

module.exports = router;