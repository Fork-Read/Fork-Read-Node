var mongoose = require('mongoose'),
  crypto = require('crypto');

/*
 * User Schema - Describes the basic structure of the User Data
 *
 * name         - User's name
 * email        - User's email
 * contact      - Users's contact number
 * pictureUrl   - User's profile pic url
 * gender       - User's gender
 * location     - User's location with latitude and longitude
 * active       - User is active or inactive
 * isGoogle     - true if google logged in
 * isFacebook   - true if facebook logged in
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
  'contact': {
    'type': String,
    'trim': true
  },
  'pictureUrl': String,
  'gender': String,
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
  'isGoogle': {
    'type': Boolean,
    'default': false
  },
  'isFacebook': {
    'type': Boolean,
    'default': false
  },
  'role': {
    'type': String,
    'default': 'user'
  },
  'oauthToken': String,
  'refreshToken': String,
  'accessToken': String,
  'salt': String,
  'created_at': {
    'type': String,
    'default': (Date.now()).toString()
  },
  'isVerified': {
    'type': Boolean,
    'default': true
  }
});

/**
 * Pre hooks
 */

schema.pre('save', function (next) {
  this.salt = this.makeSalt();
  this.accessToken = this.encryptToken(this.oauthToken);
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
  .path('contact')
  .validate(function (contact) {
    return contact.length;
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
  encryptToken: function (oauthToken) {
    if (!oauthToken || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(oauthToken, salt, 10000, 64).toString('base64');
  }
};

module.exports = mongoose.model('user', schema);