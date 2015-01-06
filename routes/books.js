var 
	express = require('express'),
	forEach = require('async-foreach').forEach,
	router = express.Router(),
	UserModel = require('../models/UserModel'),
	BookModel = require('../models/BookModel');

router.get('/:user', function(req, res) {
	var user = req.param('user');

	var returnObj = [];

	if(user){
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
	}
	else{
		res.redirect('/noResult');
	}
});

router.post('/save', function(req, res) {

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
	      "thumbnail": "http://www.google.com"
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
	      "thumbnail": "http://www.gmail.com"
	    }
	  ]
	}*/

	var user = req.body.user;
	var books = req.body.books;

	if(user && books){
		UserModel.findOne({'_id': user}, function(err, user) {
			if(err) {
				return console.error(err);
			}

			if(user){

				var operations = [];

				operations.push(function(user, bookItem, ownedBooks){
					BookModel.findOne({'isbn': bookItem.isbn}, function(err, book) {
						if(err) {
							return console.error(err);
						}

						if(book) {
							if(!(ownedBooks.indexOf(book._id) > -1)) {
								ownedBooks.push(book._id);
								user.update({books: ownedBooks}, function(err, user) {
									if(err) {
										return console.error(err)
									}
								});
							}
						}
						else {
							var newBook = new BookModel({
								isbn: bookItem.isbn,
								title: bookItem.title,
								authors: bookItem.authors,
								genre: bookItem.genre,
								publishers: bookItem.publishers,
								publishedDate: bookItem.publishedDate,
								thumbnail: bookItem.thumbnail
							});

							newBook.save(function(err, newBook) {
								if(err) {
									return console.error(err);
								}

								ownedBooks.push(newBook._id);
								user.update({'books': ownedBooks}, function(err, user) {
									if(err) {
										return console.error(err)
									}
								});
							});
						}
					});
				});

				console.log('books');

				for(var i=0; i<books.length; i++){
					var isbn = books[i].isbn;
					var bookItem = books[i];

					var ownedBooks = user.books;
					forEach(operations, function(item, index, arr){
						console.log(bookItem);
						item(user, bookItem, ownedBooks);
					});
				}

				// TODO Right now not waiting for database calls to complete. use parallel calls to handle this in nodejs
				// http://stackoverflow.com/questions/10551499/simplest-way-to-wait-some-asynchronous-tasks-complete-in-javascript
				res.set('Content-Type', 'application/json');
				res.send(JSON.stringify({}));
				
			}
			else{
				res.redirect('/noResult');
			}
		});
	}
	else{
		res.redirect('/noResult');
	}
});

router.post('/search', function(req, res) {
	var searchLocation = req.body;
	var targetUser = req.body.user;
	var targetISBN = req.body.isbn;
	var distance;
	var returnList = [];
	var returnObj = {};

	if(searchLocation.latitude && searchLocation.longitude) {
		UserModel.find(function(err, users) {
			if(err) {
				return console.error(err);
			}

			users.forEach(function(user) {

				if(targetUser && user._id === targetUser){
					return;
				}
				distance = getDistance(parseFloat(searchLocation.latitude), parseFloat(searchLocation.longitude),
									parseFloat(user.currentLocation.latitude), parseFloat(user.currentLocation.longitude));

				if(distance < 50) {
					distance = distance.toFixed(2);
					for(var i=0; i<user.books.length; i++) {
						returnObj = {};
						BookModel.findOne({'_id': user.books[i]}, function(err, book) {
							if(err){
								book = null;
							}

							if(targetISBN){
								if(book && (book.isbn === targetISBN)) {
									returnObj.userDetails = user;
									returnObj.bookDetails = book;
									returnObj.distance = distance + 'km';
									returnList.push(returnObj);	
								}
							}
							else{
								if(book) {
									returnObj.userDetails = user;
									returnObj.bookDetails = book;
									returnObj.distance = distance + 'km';
									returnList.push(returnObj);	
								}
							}

						});
					}
				}
			});
			setTimeout(function(){
				res.set('Content-Type', 'application/json');
				res.send(JSON.stringify({results: returnList}));
			}, 1000);
		});
	}
	else{
		res.redirect('/noResult');
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
