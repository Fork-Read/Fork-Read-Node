var
    express = require('express'),
    mongoose = require("mongoose"),
    async = require('async'),
    router = express.Router(),
    UserModel = require('../models/UserModel'),
    UserBookModel = require('../models/UserBookModel'),
    BookController = require('../controllers/BookController');

router.get('/:user', function (req, res) {
    var user = req.param('user');

    if (user) {
        BookController.getUserBooks(user, function (returnObj) {
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(returnObj));
        });
    } else {
        res.redirect('/noResult');
    }
});

router.post('/save', function (req, res) {

    if (req.body.user && req.body.books) {
        BookController.addToOwnList(req.body.user, req.body.books, req.elasticClient, function (data) {
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(data));
        });
    } else {
        res.redirect('/noResult');
    }
});

router.post('/search', function (req, res) {
    BookController.search(req.body.user, req.body.book_filter, req.body.radius, req.body.search_location, req.elasticClient, function (searchResult) {
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(searchResult));
    })
});

// Disown Book
router.post('/disown', function (req, res) {
    var user = req.body.user,
        book = req.body.book;

    var newOwnedList = [];

    if (user) {
        UserBookModel.findOne({
            user_id: user,
            book_id: book
        }, function (err, userBook) {
            if (err) return console.error(err);

            if (userBook) {
                UserBookModel.findOneAndUpdate({
                    user_id: user,
                    book_id: book
                }, {
                    isOwner: false
                }, function (err, userBook) {
                    if (err) return console.error(err);

                    res.set('Content-Type', 'application/json');
                    res.send(JSON.stringify(true));
                });
            }
        });
    } else {
        res.redirect('/noResult');
    }
});

module.exports = router;