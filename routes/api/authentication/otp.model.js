let mongoose = require('mongoose');

/*
 * Book Wishlist Schema - Describes the basic structure of the Wishlist Books Table
 *
 * book_id        	- _id of the book
 * user_id        	- _id of the logged in user
 * created_at      	- Date in milliseconds on which user wished the book
 *
 */

let schema = mongoose.Schema({
  'number': {
    'type': String,
    'trim': true
  },
  'otp': {
    'type': String,
    'trim': true
  },
  'created_at': {
    'type': String,
    'trim': true,
    'default': (Date.now()).toString()
  }
});

module.exports = mongoose.model('otp', schema);