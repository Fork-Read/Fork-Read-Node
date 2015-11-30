var
  express = require('express'),
  router = express.Router(),
  gcm = require('node-gcm'),
  controller = require('./authentication.controller'),
  helpers = require('../helpers');

/**
 * @swagger
 * resourcePath: /authentication
 * description: Authentication API
 */

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

/**
 * @swagger
 * path: /verify
 * operations:
 *   -  httpMethod: POST
 *      summary: Verify sent OTP
 *      notes: Returns if verified or not
 *      nickname: verify
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: number
 *          description: Number to verify
 *          paramType: query
 *          required: true
 *          dataType: string
 *        - name: otp
 *          description: OTP to confirm
 *          paramType: query
 *          required: true
 *          dataType: string
 */

router.post('/verify', controller.verify);

module.exports = router;