let
  mongoose          = require('mongoose'),
  mongoosePaginate  = require('mongoose-paginate'),
  changeCase        = require('change-case');

/*
 * Book Schema - Describes the basic structure of the Book Data
 *
 * title          - Book title
 * description    - Book description
 * image          - Book Image
 * isbn           - Book ISBN
 *
 */

let schema = mongoose.Schema({
  'title': {
    'type': String,
    'trim': true
  },
  'description': {
    'type': String,
    'trim': true
  },
  'image': {
    'type': String,
    'trim': true
  },
  'isbn': {
    'type': String,
    'trim': true
  },
  'created_at': {
    'type': Date,
    'default': Date.now()
  },
  'updated_at': {
    'type': Date,
    'default': Date.now()
  },
});

/**
 * Pre hooks
 */

schema.pre('save', function (next) {
  this.title = changeCase.titleCase(this.title);
  next();
});

/*
 * Virtual Methods
 */

schema.virtual('id').get(function(){
    return this._id.toHexString();
});


/*
  Plugins
*/
schema.plugin(mongoosePaginate);



module.exports = mongoose.model('book', schema);






