var mongoose    = require('mongoose'),
    changeCase  = require('change-case');

/*
 * Genre Schema - Describes the basic structure of the Genre Data
 *
 * name         - Genre name
 * description  - Genre description
 *
 */

var schema = mongoose.Schema({
  'name': {
    'type': String,
    'trim': true
  },
  'description': {
    'type': String,
    'trim': true,
    'default': ''
  }
});

/**
 * Pre hooks
 */

schema.pre('save', function (next) {
  this.name = changeCase.titleCase(this.name);
  next();
});

/*
 * Virtual Methods
 */

schema.virtual('id').get(function(){
    return this._id.toHexString();
});

/*
 * User Schema Validations
 */

schema
  .path('name')
  .validate(function (name) {
    return name.length;
  }, 'Name cannot be blank');


module.exports = mongoose.model('genre', schema);