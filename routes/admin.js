var express = require('express');
var router = express.Router();

/* GET Admin Homepage */
router.get('/', function(req, res) {
  res.render('admin-login');
});

module.exports = router;
