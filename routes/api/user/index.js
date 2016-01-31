var
  express = require('express'),
  router = express.Router(),
  gcm = require('node-gcm'),
  controller = require('./user.controller'),
  helpers = require('../helpers');

/**
 * @swagger
 * resourcePath: /user
 * description: User API
 */

/**
 * @swagger
 * models:
 *   User:
 *     id: User
 *     properties:
 *       name:
 *         type: String
 *       email:
 *         type: String
 *       contact:
 *         type: String
 *       active:
 *         type: Boolean
 */

/**
 * @swagger
 * path: /
 * operations:
 *   -  httpMethod: GET
 *      summary: Get array of all users
 *      responseClass: User
 */

router.get('/', controller.get);

/**
 * @swagger
 * path: /:id
 * operations:
 *   -  httpMethod: GET
 *      summary: Returns user with specific id
 *      notes: Returns a user based on the number sent
 *      responseClass: User
 */

router.get('/:id', controller.getById);

/**
 * @swagger
 * path: /login
 * operations:
 *   -  httpMethod: GET
 *      summary: Returns access token of the user
 *      notes: Returns a user based on the number sent
 *      responseClass: User
 *      nickname: login
 */

router.post('/login', controller.login);

/**
 * @swagger
 * path: /create
 * operations:
 *   -  httpMethod: POST
 *      summary: Register User
 *      notes: Returns user object with accessToken to be sent in every request as header X-Access-Token
 *      responseClass: String
 *      nickname: signup
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: name
 *          description: User's Name
 *          paramType: query
 *          required: true
 *          dataType: string
 *        - name: email
 *          description: User's Email
 *          paramType: query
 *          required: true
 *          dataType: string
 *        - name: contact
 *          description: Verified Contact Number
 *          paramType: query
 *          required: true
 *          dataType: string
 *        - name: location
 *          description: location
 *          paramType: query
 *          required: true
 *          dataType: json
 */

router.post('/', controller.create);

router.post('/message/send', function (req, res) {

  if (!req.body.user && !req.body.targetUser) {
    res.redirect('/noResult');
  }

  controller.sendMessage(req.body.user, req.body.targetUser, req.body.message, function (isSent) {
    if (isSent) {
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify(isSent));
    } else {
      res.redirect('/noResult');
    }
  });
});

router.get('/messages', function (req, res) {

  if (!req.body.user && !req.body.device) {
    res.redirect('/noResult');
  }

  controller.getMessage(req.body.user, req.body.device, function (message) {
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(message));
  });
});

module.exports = router;