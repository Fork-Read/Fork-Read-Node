let
  mongoose    = require('mongoose');

/*
 * UserGenre Schema - Describes the basic structure of the User Genre Mapping
 *
 * user_id         - User ID
 * genre_id        - Genre ID
 *
 */

let schema = mongoose.Schema({
  'user_id': {
    'type': String
  },
  'genre_id': {
    'type': String
  }
});

module.exports = mongoose.model('user_genre', schema);