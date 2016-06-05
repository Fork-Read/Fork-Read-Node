var
  express 		= require('express'),
  router 			= express.Router(),
  controller 	= require('./user.controller'),
  helpers 		= require('../helpers');

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

router.get('/', helpers.authenticate, controller.get);

/**
 * @swagger
 * path: /:id
 * operations:
 *   -  httpMethod: GET
 *      summary: Returns user with specific id
 *      notes: Returns a user based on the number sent
 *      responseClass: User
 */

router.get('/:id', helpers.authenticate, controller.getById);

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

/**
 * @swagger
 * path: /:id
 * operations:
 *   -  httpMethod: PUT
 *      summary: Updates the user details with received user details if he's the logged in user
 *      notes: User Data Updation
 *      responseClass: User
 *      nickname: update
 */

router.put('/:id', helpers.authenticate, controller.update);


/**
 * @swagger
 * path: /:id
 * operations:
 *   -  httpMethod: PUT
 *      summary: Updates the user details with received user details if he's the logged in user
 *      notes: User Data Updation
 *      responseClass: User
 *      nickname: update
 */

router.post('/:id/genre/map', helpers.authenticate, controller.mapGenres);

module.exports = router;