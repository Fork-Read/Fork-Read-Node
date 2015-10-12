var
    express = require('express'),
    router = express.Router(),
    controller = require('./book.controller'),
    helpers = require('../helpers');

/**
 * @swagger
 * resourcePath: /books
 * description: Books API
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
 * path: /
 * operations:
 *   -  httpMethod: POST
 *      summary: Save book to DB and Elastic Search
 *      notes: Returns the saved book details
 *      responseClass: Book
 *      nickname: save
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: isbn
 *          description: ISBN number of Book
 *          paramType: query
 *          required: true
 *          dataType: string
 *        - name: title
 *          description: Book title
 *          paramType: query
 *          required: true
 *          dataType: string
 *        - name: authors
 *          description: String array of authors
 *          paramType: query
 *          required: true
 *          dataType: array
 *        - name: genre
 *          description: Genre of the Book
 *          paramType: query
 *          required: true
 *          dataType: string
 *        - name: publisher
 *          description: Publisher
 *          paramType: query
 *          required: true
 *          dataType: string
 *        - name: publishedDate
 *          description: Published Date (dd-mm-yyyy)
 *          paramType: query
 *          required: true
 *          dataType: string
 *        - name: thumbnail
 *          description: Picture URL of the book
 *          paramType: query
 *          required: true
 *          dataType: string
 *        - name: description
 *          description: Book Description
 *          paramType: query
 *          required: true
 *          dataType: string
 */

router.post('/', helpers.authenticate, controller.save);

module.exports = router;