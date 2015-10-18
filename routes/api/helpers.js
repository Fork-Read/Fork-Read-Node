var User = require('./user/user.model');

var Helper = function () {};

Helper.prototype.authenticate = function (req, res, next) {
    var self = this;
    if (req.headers['x-access-token']) {
        req.accessToken = req.headers['x-access-token'];
        User.findOne({
            'accessToken': req.accessToken
        }, function (err, user) {
            if (err) {
                self.handleError(res, err);
            }
            if (user) {
                req.user = user;
                next();
            } else {
                self.accessDenied(res);
            }
        })
    } else {
        self.accessDenied(res);
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

function accessDenied(res) {
    return res.status(403).send({
        'message': 'User is not authenticated. Please authenticate.'
    });
}

module.exports = new Helper();