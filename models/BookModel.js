var mongoose = require('mongoose');

var bookSchema = mongoose.Schema({
	isbn: String,
	title: String,
	authors: Array,
	genre: Array,
	publishers: String,
	publishedDate: String,
	thumbnail: String,
	description: String
});

var BookModel = mongoose.model('Book', bookSchema);

module.exports = BookModel;