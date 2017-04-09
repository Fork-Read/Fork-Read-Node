let
  express 		= require('express'),
  router 			= express.Router(),
  controller 	= require('./user.controller'),
  helpers 		= require('../helpers');


router.get('/', helpers.authenticate, controller.get);


router.get('/:id', helpers.authenticate, controller.getById);


router.post('/', controller.create);


module.exports = router;