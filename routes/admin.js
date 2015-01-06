var 
	express = require('express'),
	router = express.Router(),
	passport = require('passport'),
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
	UserModel.find({}, {}, { skip: startIndex, limit: pageSize }, function(err, users) {
			if(err) {
				return console.error(err);
			}

			UserModel.count({}, function(err, count){
				var pageCount = Math.ceil(count/pageSize);
				res.render('admin-users', {users: users, totalPages: pageCount, currentPage: currentPage});
			});
		});
});

router.get('/books', isAuthenticated, function(req, res) {
	BookModel.find({}, function(err, books) {
			if(err) {
				return console.error(err);
			}

			res.render('admin-books', {books: books});
		});
});

router.get('/login', function(req, res) {
	res.render('admin-login');
});

router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/admin/login');
});

router.post('/authenticate', passport.authenticate('local', { 
	successRedirect: '/admin',
    failureRedirect: '/admin/login',
    failureFlash: false })
);

module.exports = router;