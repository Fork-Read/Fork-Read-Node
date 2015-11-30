var
  express = require('express'),
  router = express.Router(),
  gcm = require('node-gcm'),
  controller = require('./authentication.controller'),
  helpers = require('../helpers');

/**
 * @swagger
 * path: /otp
 * operations:
 *   -  httpMethod: POST
 *      summary: Send OTP for verfication
 *      notes: Returns the sent OTP
 *      nickname: otp
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: number
 *          description: Number to verify
 *          paramType: query
 *          required: true
 *          dataType: string
 */

router.post('/otp', controller.otp);

router.post('/verify', controller.verify);

module.exports = router;