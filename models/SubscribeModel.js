var mongoose = require('mongoose');

var subscribeSchema = mongoose.Schema({
    email: String
});

var SubscribeModel = mongoose.model('Subscribe', subscribeSchema);

module.exports = SubscribeModel;