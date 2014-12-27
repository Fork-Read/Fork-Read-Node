var express = require('express');
var router = express.Router();
var SubscribeModel = require('../models/SubscribeModel');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/noResult', function(req, res) {
	res.set('Content-Type', 'application/json');
	res.send(JSON.stringify({}));
});

router.get('/subscribe/:email', function(req, res) {
	var email = req.param('email');

	var subscription = new SubscribeModel({
		'email': email
	});

	subscription.save(function(err, subscription) {
		if(err) {
			res.set('Content-Type', 'application/json');
			res.send(JSON.stringify({isAdded: false}));
		}

		res.set('Content-Type', 'application/json');
		res.send(JSON.stringify({isAdded: true}));
	});
});

module.exports = router;
