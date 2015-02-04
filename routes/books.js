var 
	express = require('express'),
	async = require('async'),
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

			var ownedBooks = user.books;

			if(user){
				async.each(books,
					// 2nd param is the function that each item is passed to
					function(bookItem, callback){
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
										callback();
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
									thumbnail: bookItem.thumbnail,
									description: bookItem.description
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
										callback();
									});
								});
							}
						});
				  	},
				  	// 3rd param is the function to call when everything's done
				  	function(err){
				    	// All tasks are done now
				    	res.set('Content-Type', 'application/json');
						res.send(JSON.stringify({}));
				  	}
				);
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
	res.set('Content-Type', 'application/json');
	res.send(JSON.stringify({}));
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

// Disown Book
router.post('/disown', function(req, res) {
	var user = req.body.user,
		book = req.body.book;

	var newOwnedList = [];

	if(user) {
		UserModel.findOne({_id: user}, function(err, user) {
			if(err) {
				return console.error(err);
			}

			if(user){
				for(var i=0; i<user.books.length; i++){
					// No strict checking as in mongodb it might be in ObjectId format
					if(user.books[i] != book){
						newOwnedList.push(user.books[i]);
					}
				}

				UserModel.findOneAndUpdate({_id: user}, {books: newOwnedList}, function(err, user) {
					if(err) {
						return console.error(err);
					}

					res.set('Content-Type', 'application/json');
					res.send(JSON.stringify(true));
					
				});
			}
			
		});
	}
	else{
		res.redirect('/noResult');
	}
});


module.exports = router;
