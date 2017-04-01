let
  express 		= require('express'),
  router 			= express.Router(),
  controller 	= require('./user_genre.controller');


router.post('/', helpers.authenticate, controller.create);


module.exports = router;