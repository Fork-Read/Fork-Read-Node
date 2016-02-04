var mongoose = require('mongoose'),
    crypto = require('crypto');

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

var schema = mongoose.Schema({
  'name': {
    'type': String,
    'trim': true
  },
  'email': {
    'type': String,
    'trim': true
  },
  'number': {
    'type': String,
    'trim': true
  },
  'location': {
    'position': {
      'latitude': String,
      'longitude': String
    },
    'address': {
      'location': String,
      'street': String,
      'city': String,
      'state': String,
      'country': String,
      'zipcode': String,
      'formatted_address': String
    },
  },
  'active': {
    'type': String,
    'default': true
  },
  'role': {
    'type': String,
    'default': 'User'
  },
  'accessToken': String,
  'salt': String,
  'created_at': {
    'type': String,
    'default': (Date.now()).toString()
  },
  'isVerified': {
    'type': Boolean,
    'default': false
  }
});

/**
 * Pre hooks
 */

schema.pre('save', function (next) {
  this.salt = this.makeSalt();
  this.accessToken = this.encryptToken(this.number);
  next();
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

/*
 * User Schema Methods
 */
schema.methods = {
  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function () {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptToken: function (number) {
    if (!number || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(number, salt, 10000, 64).toString('base64');
  }
};

module.exports = mongoose.model('user', schema);