var User = require('./user/user.model');

var Helper = function () {};

Helper.prototype.authenticate = function (req, res, next) {

  let self = this;
  let uuid = req.headers['uuid'];

  if (uuid) {

    User.findOne({
      uuid
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
};

Helper.prototype.handleError = function (res, err) {

  return res.status(500).send(err);
};

Helper.prototype.missingParams = function (res) {

  return res.status(200).send({
    'message': 'Parameters missing'
  });
};

Helper.prototype.permissionDenied = function (res) {

  return res.status(200).send({
    'message': 'Permission Denied'
  });
};

Helper.prototype.badRequest = function(res, msg) {
  
  return res.status(400).send({
    'message': msg
  });
};

function accessDenied(res) {

  return res.status(403).send({
    'message': 'User is not authenticated. Please authenticate.'
  });
}

module.exports = new Helper();