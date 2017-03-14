let
  express 		= require('express'),
  router 			= express.Router(),
  controller 	= require('./authentication.controller'),
  helpers 		= require('../helpers');


router.post('/otp_send', controller.otp_send);


router.post('/otp_resend', controller.otp_resend);


router.post('/otp_verify', controller.otp_verify);

module.exports = router;