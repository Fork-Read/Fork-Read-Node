var express = require('express');
var router = express.Router();
var passport = require('passport');

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

router.get('/login', function(req, res) {
	res.render('admin-login');
});

router.post('/authenticate', passport.authenticate('local', { 
	successRedirect: '/admin',
    failureRedirect: '/admin/login',
    failureFlash: false })
);

module.exports = router;