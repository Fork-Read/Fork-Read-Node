let
  express 		= require('express'),
  router 			= express.Router(),
  controller 	= require('./genre.controller'),
  helpers 		= require('../helpers');


router.get('/', helpers.authenticate, controller.getAll);


router.get('/:id', helpers.authenticate, controller.getById);


router.post('/', helpers.authenticate, controller.create);


router.put('/:id', helpers.authenticate, controller.update);


module.exports = router;