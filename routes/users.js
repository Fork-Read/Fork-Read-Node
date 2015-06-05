var
    express = require('express'),
    router = express.Router(),
    gcm = require('node-gcm'),
    UserController = require('../controllers/UserController');

router.get('/:email', function (req, res) {
    var email = req.param('email');

    if (email) {
        UserController.getUserByEmail(email, function (user) {
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

router.post('/save', function (req, res) {

    var email = req.body.email;

    if (email) {
        UserController.save(req.body, function (user) {
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(user));
        });
    } else {
        res.redirect('/noResult');
    }
});

router.post('/update', function (req, res) {
    var email = req.body.user_id;

    if (email) {
        UserController.updateHomeLocation(user, req.body.location, function (user) {
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(user));
        });
    } else {
        res.redirect('/noResult');
    }
});

router.post('/sendMessage', function (req, res) {

    if (!req.body.user && !req.body.targetUser) {
        res.redirect('/noResult');
    }

    UserController.message(req.body.user, req.body.targetUser, req.body.message, function (isSent) {
        if (isSent) {
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify({}));
        } else {
            res.redirect('/noResult');
        }
    });
});

module.exports = router;