var mongoose = require('mongoose'),
    crypto = require('crypto'),
    changeCase = require('change-case'),
    md5 = require('md5');

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
  'password': {
    'type': String
  },
  'location': {
    'position': {
      'latitude': String,
      'longitude': String
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
  'uuid': String,
  'salt': String,
  'created_at': {
    'type': String,
    'default': (Date.now()).toString()
  },
  'updated_at': {
    'type': String,
    'default': (Date.now()).toString()
  },
});

/**
 * Pre hooks
 */

schema.pre('save', function (next) {
  this.name = changeCase.titleCase(this.name);
  this.salt = this.makeSalt();
  this.uuid = this.encryptToken(this.number);
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