var express = require('express');
var router = express.Router();
var UserModel = require('../models/UserModel');
var BookModel = require('../models/BookModel');

router.get('/:user', function(req, res) {
	var user = req.param('user');

	var returnObj = [];

	UserModel.findOne({'_id': user}, function(err, user) {
		if(err) {
			return console.error(err);
		}

		var i = 0;

		for(; i< user.books.length; i++) {
			BookModel.findOne({_id: user.books[i]}, function(err, book) {
				if(err) {
					return console.error(err);
				}

				if(book){
					returnObj.push(book);
				}

				// Return Book Data if this is the last query
				if(i = user.books.length - 1){
					res.set('Content-Type', 'application/json');
					res.send(JSON.stringify(returnObj));
				}
			});
		}
	});
});

router.post('/save', function(req, res) {

	var isbn = req.body.isbn;
	var user = req.body.user;

	if(isbn && user) {
		UserModel.findOne({_id: user}, function(err, user) {
			if(err) {
				return console.error(err);
			}

			if(user){
				BookModel.findOne({isbn: isbn}, function(err, book) {
					if(err) {
						return console.error(err);
					}

					var ownedBooks = user.books;

					if(book) {
						console.log('existing book');
						if(!(ownedBooks.indexOf(book._id) > -1)) {
							ownedBooks.push(book._id);
							user.update({books: ownedBooks}, function(err, user) {
								if(err) {
									return console.error(err)
								}
							});
						}

						res.set('Content-Type', 'application/json');
						res.send(JSON.stringify(book));
					}
					else {
						var newBook = new BookModel({
							isbn: req.body.isbn,
							title: req.body.title,
							authors: req.body.authors,
							genre: req.body.genre,
							publishers: req.body.publishers,
							publishedDate: req.body.publishedDate,
							thumbnail: req.body.thumbnail
						});

						console.log('new book');

						newBook.save(function(err, newBook) {
							if(err) {
								return console.error(err);
							}

							ownedBooks.push(book._id);
							user.update({books: ownedBooks}, function(err, user) {
								if(err) {
									return console.error(err)
								}
							});

							res.set('Content-Type', 'application/json');
							res.send(JSON.stringify(newBook));
						});
					}
				});
			}
		});
	}
});

router.post('/search', function(req, res) {
	var searchLocation = req.body;
	var distance;
	var returnList = [];

	if(searchLocation.latitude && searchLocation.longitude) {
		UserModel.find(function(err, users) {
			if(err) {
				return console.error(err);
			}

			users.forEach(function(user) {
				distance = getDistance(parseFloat(searchLocation.latitude), parseFloat(searchLocation.longitude),
									parseFloat(user.currentLocation.latitude), parseFloat(user.currentLocation.longitude));

				if(distance < 50) {
					returnList.push(user);
				}
			});
			res.set('Content-Type', 'application/json');
			res.send(JSON.stringify(returnList));
		});
	}
});

// Calculates Distance in Km
function getDistance(lat1, lon1, lat2, lon2) {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var radlon1 = Math.PI * lon1/180
    var radlon2 = Math.PI * lon2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    dist = dist * 1.609344 
    return dist
}


module.exports = router;
