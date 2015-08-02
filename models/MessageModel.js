var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    user_id: String,
    target_user_id: String,
    message: String,
    device_ids: Array,
    created_at: Date
});

var MessageModel = mongoose.model('Message', messageSchema);

module.exports = MessageModel;