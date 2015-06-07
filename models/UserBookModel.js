var mongoose = require('mongoose');

var userBookSchema = mongoose.Schema({
    user_id: String,
    book_id: String,
    isOwner: Boolean,
    isLiked: Boolean,
    isWished: Boolean
});

var UserBookModel = mongoose.model('UserBook', userBookSchema);

module.exports = UserBookModel;