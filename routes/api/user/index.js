let
  express 		= require('express'),
  router 			= express.Router(),
  controller 	= require('./user.controller'),
  helpers 		= require('../helpers');


router.get('/', helpers.authenticate, controller.get);


router.get('/:id', helpers.authenticate, controller.getById);


router.post('/login', controller.login);


router.post('/', controller.create);


router.put('/:id', helpers.authenticate, controller.update);


router.post('/:id/genre/map', helpers.authenticate, controller.mapGenres);


module.exports = router;