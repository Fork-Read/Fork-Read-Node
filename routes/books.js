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

    /* Search Requst Structure
	{
	  "user": "54db950b3d7415b4183262f5"
	  "radius": 5,
	  "bookFilter": {
	    "type": "isbn",
	    "value": "123456"
	  },
	  "searchLocation": {
	    "position": {
	      "latitude": "12.940882",
	      "longitude": "77.6292825"
	    },
	    "address": {
	      "location": "jhgfvjdsf",
	      "street": "isfjskdf",
	      "city": "Bangalore",
	      "state": "Karnataka",
	      "country": "India",
	      "zipcode": "560029",
	      "formatted_address": "kjdfbdbnfbdfng"
	    }
	  }
	}*/

    var searchedLocation;

    if (req.body.searchLocation) {
        searchedLocation = req.body.searchLocation;
    }

    var searchedFilter = {},
        searchResult = {
            results: []
        },
        user = req.body.user;

    searchedFilter[req.body.bookFilter.type] = req.body.bookFilter.value;

    switch (req.body.bookFilter.type) {
    case 'title':
        searchedFilter = {
            title: req.body.bookFilter.value
        };
        break;
    case 'isbn':
        searchedFilter = {
            'isbn': req.body.bookFilter.value
        };
        break;
    case 'genre':
        searchedFilter = {
            genre: req.body.bookFilter.value
        };
        break;
    case 'author':
        searchedFilter = {
            'authors': req.body.bookFilter.value
        };
        break;
    default:
        searchedFilter = {
            title: req.body.bookFilter.value
        };
        break;
    }

    req.elasticClient.search({
        index: 'forkread',
        type: 'books',
        size: 50,
        body: {
            query: {
                match: searchedFilter
            }
        }
    }).then(function (resp) {

        var books = resp.hits.hits;

        if (!books.length) {
            // Send searchResult as empty array
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(searchResult));
            return;
        }

        async.each(books,
            // 2nd param is the function that each item is passed to
            function (bookItem, callback) {

                // Reset Item for every new book
                var searchResultItem = {};
                bookItem = bookItem._source;

                searchResultItem['book'] = bookItem;
                searchResultItem['owners'] = [];

                UserBookModel.find({
                    book_id: bookItem._id
                }, function (err, users) {
                    if (err) return console.error(err);
                    if (!userBooks.length) {
                        callback();
                    } else {
                        async.each(userBooks, function (userItem, next) {
                            LocationModel.findOne({
                                user_id: userItem._id,
                                isHome: true
                            }, function (err, userLocation) {
                                if (err) return console.error(err);
                                dist = getDistance(userLocation.position.latitude, userLocation.position.longitude, searchedLocation.position.latitude, searchedLocation.position.longitude);
                                if (dist < parseFloat(req.body.radius)) {
                                    searchResultItem.owners.push(userItem._id);
                                }
                                next();
                            });
                        }, function (err) {
                            callback();
                        });
                    }
                });
            },
            // 3rd param is the function to call when everything's done
            function (err) {
                // All tasks are done now. Send the searchResult Object
                res.set('Content-Type', 'application/json');
                res.send(JSON.stringify(searchResult));
            }
        );
    }, function (error) {
        console.trace(error.message);
    });
});

// Calculates Distance in Km
function getDistance(lat1, lon1, lat2, lon2) {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var radlon1 = Math.PI * lon1 / 180
    var radlon2 = Math.PI * lon2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    dist = dist * 1.609344
    return dist
}

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