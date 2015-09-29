var Helper = function () {};

Helper.prototype.authenticate = function (req, res, next) {
    if (req.headers['x-access-token']) {
        req.accessToken = req.headers['x-access-token'];
        next();
    } else {
        accessDenied(res);
    }
}

Helper.prototype.handleError = function (res, err) {
    return res.status(500).send(err);
}

function accessDenied(res) {
    return res.status(403).send({
        'message': 'User is not authenticated. Please authenticate.'
    });
}

module.exports = new Helper();