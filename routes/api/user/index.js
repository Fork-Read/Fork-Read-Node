var
    express = require('express'),
    router = express.Router(),
    gcm = require('node-gcm'),
    controller = require('./user.controller');

router.get('/:email', function (req, res) {
    var email = req.param('email');

    if (email) {
        controller.getUserByEmail(email, function (user) {
            if (user) {
                res.set('Content-Type', 'application/json');
                res.send(JSON.stringify(user));
            } else {
                res.set('Content-Type', 'application/json');
                res.send(JSON.stringify({}));
            }
        });
    } else {
        res.redirect('/noResult');
    }
});

router.post('/', controller.create);

router.post('/message/send', function (req, res) {

    if (!req.body.user && !req.body.targetUser) {
        res.redirect('/noResult');
    }

    controller.sendMessage(req.body.user, req.body.targetUser, req.body.message, function (isSent) {
        if (isSent) {
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(isSent));
        } else {
            res.redirect('/noResult');
        }
    });
});

router.get('/messages', function (req, res) {

    if (!req.body.user && !req.body.device) {
        res.redirect('/noResult');
    }

    controller.getMessage(req.body.user, req.body.device, function (message) {
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(message));
    });
});

module.exports = router;