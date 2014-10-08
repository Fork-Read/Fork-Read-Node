var mongoose = require('mongoose');

var bookSchema = mongoose.Schema({
	isbn: String,
	title: String,
	authors: Array,
	genre: String,
	publishers: Array,
	publishedDate: String,
	thumbnail: String
});

var BookModel = mongoose.model('Book', bookSchema);

module.exports = BookModel;