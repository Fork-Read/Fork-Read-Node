var 
	express = require('express'),
	mongoose = require ("mongoose"),
	router = express.Router(),
	passport = require('passport'),
	async = require('async'),
	UserModel = require('../models/UserModel'),
	BookModel = require('../models/BookModel');

function isAuthenticated(req, res, next) {

    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    if (req.user && req.user._id)
        return next();

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.redirect('/admin/login');
}

/* GET Admin Homepage */
router.get('/', isAuthenticated, function(req, res) {
	res.render('admin-index');
});

// Show List of Active Users
router.get('/users', isAuthenticated, function(req, res) {
	var startIndex,
		currentPage,
		pageSize = 10;

	if(req.query && req.query.page){
		currentPage = parseInt(req.query.page);
		startIndex = (currentPage-1) * pageSize;
	}
	else{
		currentPage = 1;
		startIndex = 0;
	}
	UserModel.find({isActive: true}, {}, { skip: startIndex, limit: pageSize }, function(err, users) {
			if(err) {
				return console.error(err);
			}

			UserModel.count({isActive: true}, function(err, count){
				var pageCount = Math.ceil(count/pageSize);

				if(pageCount === 0){
					pageCount = 1;
				}
				res.render('admin-users', {users: users, totalPages: pageCount, currentPage: currentPage});
			});
		});
});

// Show List of Inactive Users
router.get('/users/inactive', isAuthenticated, function(req, res) {
	var startIndex,
		currentPage,
		pageSize = 10;

	if(req.query && req.query.page){
		currentPage = parseInt(req.query.page);
		startIndex = (currentPage-1) * pageSize;
	}
	else{
		currentPage = 1;
		startIndex = 0;
	}
	UserModel.find({isActive: false}, {}, { skip: startIndex, limit: pageSize }, function(err, users) {
			if(err) {
				return console.error(err);
			}

			UserModel.count({isActive: false}, function(err, count){
				var pageCount = Math.ceil(count/pageSize);

				if(pageCount === 0){
					pageCount = 1;
				}
				res.render('admin-users-inactive', {users: users, totalPages: pageCount, currentPage: currentPage});
			});
		});
});


// Show List of Owned Books
router.get('/users/books/:id', isAuthenticated, function(req, res) {
	var user = req.param('id');

	UserModel.findOne({'_id': user}, function(err, user){
		if(err){
			return console.error(err);
		}

		if(user){
			var ownedBooks = user.books;

			if(ownedBooks.length === 0){
				res.render('admin-owned-books', {user: user, books: []});
			}

			var bookList = [];
			

			// 1st para in async.each() is the array of items
			async.each(ownedBooks,
			  // 2nd param is the function that each item is passed to
				function(bookItem, callback){
			  		BookModel.findOne({'_id': bookItem}, function(err, book) {
						if(err) {
							return console.error(err);
						}

						if(book){
							bookList.push(book);
							callback();
						}
					});
			  	},
			  	// 3rd param is the function to call when everything's done
			  	function(err){
			    	// All tasks are done now
			    	res.render('admin-owned-books', {user: user, books: bookList});
			  	}
			);
		}
		else{
			// Render Incorrect Data Error Page
		}
	});
});


// Show List of Books in Database
router.get('/books', isAuthenticated, function(req, res) {
	var startIndex,
		currentPage,
		pageSize = 10;

	if(req.query && req.query.page){
		currentPage = parseInt(req.query.page);
		startIndex = (currentPage-1) * pageSize;
	}
	else{
		currentPage = 1;
		startIndex = 0;
	}

	BookModel.find({}, {}, { skip: startIndex, limit: pageSize }, function(err, books) {
			if(err) {
				return console.error(err);
			}

			BookModel.count({}, function(err, count){
				var pageCount = Math.ceil(count/pageSize);

				if(pageCount === 0){
					pageCount = 1;
				}
				res.render('admin-books', {books: books, totalPages: pageCount, currentPage: currentPage});
			});

		});
});


// Show List of Users owning a Book
router.get('/books/usersOwned/:id', isAuthenticated, function(req, res) {
	var bookId = req.param('id');

	if(bookId){
		BookModel.findOne({"_id": bookId}, function(err, book){
			if(err) {
				return console.error(err);
			}

			if(book){
				UserModel.find({books: mongoose.Types.ObjectId(bookId)}, function(err, users){
					if(err) {
						return console.error(err);
					}

					if(users){
						res.render('admin-books-usersOwned', {users: users, book: book});
					}
					else{
						res.render('admin-books-usersOwned', {users: [], book: book});
					}
				});
			}
		});
	}
	else{
		//TODO Show the error page
	}
	
});
// View Login Page
router.get('/login', function(req, res) {
	res.render('admin-login');
});

// Admin Logout
router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/admin/login');
});

// Change User Status
router.put('/user/changeStatus', function(req, res) {
	var user = req.body.user,
		isActive = req.body.isActive;

	if(user) {
		UserModel.findOneAndUpdate({_id: user}, {isActive: isActive}, function(err, user) {
			if(err) {
				res.set('Content-Type', 'application/json');
				res.send(JSON.stringify({hasChanged: false}));
				return console.error(err);
			}

			res.set('Content-Type', 'application/json');
			res.send(JSON.stringify({hasChanged: true}));
			
		});
	}
	else{
		res.redirect('/noResult');
	}
});

// Delete User
router.delete('/user/deleteUser', function(req, res) {
	var user = req.body.user;

	if(user) {
		UserModel.find({_id: user}).remove(function(err){
			if(err){
				res.set('Content-Type', 'application/json');
				res.send(JSON.stringify({deleted: false}));
			}
			else{
				res.set('Content-Type', 'application/json');
				res.send(JSON.stringify({deleted: true}));
			}
		});
	}
	else{
		res.redirect('/noResult');
	}
});


// Authenticate Admin
router.post('/authenticate', passport.authenticate('local', { 
	successRedirect: '/admin',
    failureRedirect: '/admin/login',
    failureFlash: false })
);

module.exports = router;