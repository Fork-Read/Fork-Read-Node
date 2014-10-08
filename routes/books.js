var express = require('express');
var router = express.Router();
var UserModel = require('../models/UserModel');
var BookModel = require('../models/BookModel');

router.get('/:user', function(req, res) {
	var user = req.param('user');

	var returnObj = [];

	UserModel.findOne({_id: user}, function(err, user) {
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

module.exports = router;
