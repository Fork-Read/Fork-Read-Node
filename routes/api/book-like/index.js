var
    express = require('express'),
    router = express.Router(),
    controller = require('./book-like.controller'),
    helpers = require('../helpers');

/**
 * @swagger
 * resourcePath: '/book/like'
 * description: Books Like API
 */

/**
 * @swagger
 * models:
 *   BookLike:
 *     id: BookLike
 *     properties:
 *       book_id:
 *         type: String
 *       user_id:
 *         type: String
 *       created_at:
 *         type: Array
 */

/**
 * @swagger
 * models:
 *   Book:
 *     id: Book
 *     properties:
 *       isbn:
 *         type: String
 *       title:
 *         type: String
 *       authors:
 *         type: Array
 *       genre:
 *         type: String
 *       publisher:
 *         type: String
 *       publishedDate:
 *         type: Boolean
 *       thumbnail:
 *          type: String
 *		 description:
 *			type: String
 */

/**
 * @swagger
 * path: /:id
 * operations:
 *   -  httpMethod: GET
 *      summary: Get liked books
 *      notes: Returns the list of liked books
 *      responseClass: Book
 *      nickname: add
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: id
 *          description: _id of the User (If not passed will give the current user books)
 *          paramType: query
 *          required: true
 *          dataType: string
 */

router.get('/:id?', helpers.authenticate, controller.get);

/**
 * @swagger
 * path: /:id
 * operations:
 *   -  httpMethod: POST
 *      summary: Add book to the liked list
 *      notes: Returns the liked book structure
 *      responseClass: BookLike
 *      nickname: add
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: id
 *          description: _id of the Book
 *          paramType: query
 *          required: true
 *          dataType: string
 */

router.post('/:id', helpers.authenticate, controller.add);

/**
 * @swagger
 * path: /:id
 * operations:
 *   -  httpMethod: DELETE
 *      summary: Remove book from liked list
 *      notes: Returns the deleted liked book structure
 *      responseClass: BookLike
 *      nickname: add
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: id
 *          description: _id of the Book to delete
 *          paramType: query
 *          required: true
 *          dataType: string
 */

router.delete('/:id', helpers.authenticate, controller.remove);

module.exports = router;