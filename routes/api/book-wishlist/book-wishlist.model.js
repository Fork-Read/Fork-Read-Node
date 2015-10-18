var mongoose = require('mongoose');

/*
 * Book Wishlist Schema - Describes the basic structure of the Wishlist Books Table
 *
 * book_id        	- _id of the book
 * user_id        	- _id of the logged in user
 * created_at      	- Date in milliseconds on which user wished the book
 *
 */

var schema = mongoose.Schema({
    'book_id': {
        'type': 'String',
        'trim': true
    },
    'user_id': {
        'type': 'String',
        'trim': true
    },
    'created_at': {
        'type': 'String',
        'trim': true,
        'default': (Date.now()).toString()
    }
});

module.exports = mongoose.model('book_wish', schema);