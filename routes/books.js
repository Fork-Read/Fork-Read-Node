var
    express = require('express'),
    mongoose = require("mongoose"),
    async = require('async'),
    router = express.Router(),
    UserModel = require('../models/UserModel'),
    BookModel = require('../models/BookModel');

router.get('/:user', function (req, res) {
    var user = req.param('user');

    var returnObj = [];

    if (user) {
        UserModel.findOne({
            '_id': user
        }, function (err, user) {
            if (err) {
                return console.error(err);
            }

            if (user) {
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
                                returnObj.push(book);
                                callback();
                            }
                        });
                    },
                    // 3rd param is the function to call when everything's done
                    function (err) {
                        // All tasks are done now
                        res.set('Content-Type', 'application/json');
                        res.send(JSON.stringify(returnObj));
                    }
                );
            } else {
                res.redirect('/noResult');
            }
        });
    } else {
        res.redirect('/noResult');
    }
});

router.post('/save', function (req, res) {
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
	}*/

    var user = req.body.user;
    var books = req.body.books;

    if (user && books) {
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
                    function (bookItem, callback) {
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
                                        callback();
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
                        res.set('Content-Type', 'application/json');
                        res.send(JSON.stringify({}));
                    }
                );
            } else {
                res.redirect('/noResult');
            }
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

    var searchedLocation = req.body.searchLocation;

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
    }

    //TODO Add searchedLocation in Users Collection before searching
    UserModel.findOne({
        _id: user
    }, function (err, user) {
        if (err) {
            return console.error(err);
        }

        if (user) {
            var userSearchHistory = user.searchHistory,
                alreadySearched = false;

            // Check if already searched for same filter
            for (var i = 0; i < userSearchHistory.length; i++) {
                if (req.body.bookFilter.type === userSearchHistory[i].bookFilter.type &&
                    req.body.bookFilter.value === userSearchHistory[i].bookFilter.value) {
                    alreadySearched = true;
                }
            }

            if (!alreadySearched) {
                userSearchHistory.push(req.body);
                UserModel.findOneAndUpdate({
                    _id: user
                }, {
                    searchHistory: userSearchHistory
                }, function (err, user) {
                    if (err) {
                        return console.error(err);
                    }
                });
            }
        } else {
            // Add error message for user not found
        }

    });

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

            // Return from here to prevent executing code further
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

                UserModel.find({
                    'currentLocation.address.city': searchedLocation.address.city,
                    'currentLocation.address.state': searchedLocation.address.state,
                    'currentLocation.address.country': searchedLocation.address.country,
                    'books': {
                        $in: [mongoose.Types.ObjectId(bookItem._id)]
                    }
                }, function (err, users) {
                    if (err) {
                        return console.error(err);
                    }

                    var dist;

                    for (var i = 0; i < users.length; i++) {
                        dist = getDistance(users[i].currentLocation.position.latitude, users[i].currentLocation.position.longitude, searchedLocation.position.latitude, searchedLocation.position.longitude);
                        if (dist < parseFloat(req.body.radius)) {
                            searchResultItem.owners.push(users[i]);
                        }
                    }

                    searchResult.results.push(searchResultItem);

                    callback();
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
        UserModel.findOne({
            _id: user
        }, function (err, user) {
            if (err) {
                return console.error(err);
            }

            if (user) {
                for (var i = 0; i < user.books.length; i++) {

                    if (user.books[i] !== mongoose.Types.ObjectId(book)) {
                        newOwnedList.push(user.books[i]);
                    }
                }

                UserModel.findOneAndUpdate({
                    _id: user
                }, {
                    books: newOwnedList
                }, function (err, user) {
                    if (err) {
                        return console.error(err);
                    }

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