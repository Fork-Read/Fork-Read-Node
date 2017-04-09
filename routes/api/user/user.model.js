let
  mongoose    = require('mongoose'),
  crypto      = require('crypto'),
  changeCase  = require('change-case'),
  md5         = require('md5'),
  uuidV4      = require('uuid/v4');

/*
 * User Schema - Describes the basic structure of the User Data
 *
 * name         - User's name
 * email        - User's email
 * number       - Users's contact number
 * location     - User's location with latitude and longitude
 * active       - User is active or inactive
 *
 */

let schema = mongoose.Schema({
  'name': {
    'type': String,
    'trim': true
  },
  'email': {
    'type': String,
    'trim': true,
    'index': true
  },
  'number': {
    'type': String,
    'trim': true,
    'index': true
  },
  'password': {
    'type': String
  },
  'location': {
    'geo': {
      type: [Number],
      index: '2dsphere'
    },
    'address': {
      'country': String,
      'city': String,
      'state': String,
      'street': String,
      'zipcode': String,
      'landmark': String
    },
  },
  'role': {
    'type': String,
    'default': 'User'
  },
  'isEmailVerified': {
    'type': Boolean,
    'default': false
  },
  'isNumberVerified': {
    'type': Boolean,
    'default': false
  },
  'uuid': {
    'type': String,
    'index': true
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
  this.name = changeCase.titleCase(this.name);
  this.uuid = uuidV4();
  this.password = md5(this.password);
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
  .path('email')
  .validate(function (email) {
    return email.length;
  }, 'Email cannot be blank');

schema
  .path('number')
  .validate(function (number) {
    return number.length;
  }, 'Contact Number cannot be blank');


module.exports = mongoose.model('user', schema);