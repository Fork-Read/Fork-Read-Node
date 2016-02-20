var mongoose = require('mongoose');

/*
 * Book Schema - Describes the basic structure of the Book Data
 *
 * isbn         	- ISBN number of the book
 * title        	- Book title
 * authors      	- String array of authors
 * genre	    	- Book's genre
 * publishers   	- Publisher name
 * publishedDate	- Book's published date (dd-mm-yyyy)
 * thumbnail        - Book's image
 * description		- Description about the book
 *
 */

var schema = mongoose.Schema({
    isbn: {
        'type': String,
        'trim': true
    },
    title: {
        'type': String,
        'trim': true
    },
    authors: Array,
    genre: {
        'type': String,
        'trim': true
    },
    publisher: {
        'type': String,
        'trim': true
    },
    publishedDate: {
        'type': String,
        'trim': true
    },
    thumbnail: String,
    description: {
        'type': String,
        'trim': true
    },
    created_at: {
        'type': String,
        'default': (Date.now()).toString()
    }
});


/*
 * Virtual Methods
 */

schema.virtual('id').get(function(){
    return this._id.toHexString();
});

module.exports = mongoose.model('book', schema);