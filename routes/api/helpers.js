var User = require('./user/user.model');

var Helper = function () {};

Helper.prototype.authenticate = function (req, res, next) {

  var self = this;

  if (req.headers['x-access-token']) {
    
    req.access_token = req.headers['x-access-token'];
    User.findOne({
      'access_token': req.access_token
    }, function (err, user) {
      if (err) {
        self.handleError(res, err);
      }
      if (user) {
        req.user = user;
        next();
      } else {
        accessDenied(res);
      }
    })
  } else {

    accessDenied(res);
  }
}

Helper.prototype.handleError = function (res, err) {

  return res.status(500).send(err);
}

Helper.prototype.missingParams = function (res) {

  return res.status(200).send({
    'message': 'Parameters missing'
  });
}

Helper.prototype.permissionDenied = function (res) {

  return res.status(200).send({
    'message': 'Permission Denied'
  });
}

function accessDenied(res) {

  return res.status(403).send({
    'message': 'User is not authenticated. Please authenticate.'
  });
}

module.exports = new Helper();