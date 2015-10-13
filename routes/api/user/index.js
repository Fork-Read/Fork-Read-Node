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
 *       pictureUrl:
 *         type: String
 *       gender:
 *         type: String
 *       active:
 *         type: Boolean
 *       provider:
 *          type: Number
 */

/**
 * @swagger
 * path: /me
 * operations:
 *   -  httpMethod: GET
 *      summary: Get current logged in user
 *      notes: Returns a user based on the access token set in header X-Access-Token
 *      responseClass: User
 *      nickname: me
 */

router.get('/me', helpers.authenticate, controller.me);

/**
 * @swagger
 * path: /create
 * operations:
 *   -  httpMethod: POST
 *      summary: Register User
 *      notes: Returns access token to be sent in every request as header X-Access-Token
 *      responseClass: String
 *      nickname: login
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
 *        - name: pictureUrl
 *          description: User's profile pic url from the provider
 *          paramType: query
 *          required: true
 *          dataType: string
 *        - name: provider
 *          description: Google - 1/Facebook - 2
 *          paramType: query
 *          required: true
 *          dataType: number
 *        - name: gender
 *          description: User's Gender
 *          paramType: query
 *          required: true
 *          dataType: string
 *        - name: oauthToken
 *          description: oauthToken
 *          paramType: query
 *          required: true
 *          dataType: string
 *        - name: refreshToken
 *          description: refreshToken
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