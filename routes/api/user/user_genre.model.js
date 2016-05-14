var mongoose = require('mongoose');

/*
 * User Genre Mapping Schema - Describes the basic structure of the Mapping
 *
 * user_id         - User ID
 * genre_id        - Genre ID
 *
 */

var schema = mongoose.Schema({
  'user_id': {
    'type': String,
    'trim': true
  },
  'genre_id': {
    'type': String,
    'trim': true
  }
});


/*
 * Virtual Methods
 */

schema.virtual('id').get(function(){
    return this._id.toHexString();
});


module.exports = mongoose.model('user_genre', schema);