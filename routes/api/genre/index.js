var
  express 		= require('express'),
  router 			= express.Router(),
  controller 	= require('./genre.controller'),
  helpers 		= require('../helpers');

/**
 * @swagger
 * resourcePath: /genre
 * description: Genre API
 */

/**
 * @swagger
 * models:
 *   Genre:
 *     id: Genre
 *     properties:
 *       name:
 *         type: String
 *       description:
 *         type: String
 */

/**
 * @swagger
 * path: /
 * operations:
 *   -  httpMethod: GET
 *      summary: Get array of all genres
 */

router.get('/', helpers.authenticate, controller.get);

/**
 * @swagger
 * path: /:id
 * operations:
 *   -  httpMethod: GET
 *      summary: Returns genre with specific id
 *      notes: Returns a genre based on the number sent
 *      responseClass: Genre
 */

router.get('/:id', helpers.authenticate, controller.getById);

/**
 * @swagger
 * path: /create
 * operations:
 *   -  httpMethod: POST
 *      summary: Create Genre
 *      notes: Returns new created genre
 *      responseClass: Genre
 *      nickname: save
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: name
 *          description: Genre Name
 *          paramType: query
 *          required: true
 *          dataType: string
 *        - name: description
 *          description: Genre Description
 *          paramType: query
 *          required: true
 *          dataType: string
 */

router.post('/', helpers.authenticate, controller.create);

/**
 * @swagger
 * path: /:id
 * operations:
 *   -  httpMethod: PUT
 *      summary: Update the Genre details
 *      notes: Genre Data Updation
 *      responseClass: Genre
 *      nickname: update
 */

router.put('/:id', helpers.authenticate, controller.update);

module.exports = router;