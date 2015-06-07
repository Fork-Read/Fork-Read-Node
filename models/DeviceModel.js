var mongoose = require('mongoose');

var deviceSchema = mongoose.Schema({
    user_id: String,
    device_id: String
});

var DeviceModel = mongoose.model('Device', deviceSchema);

module.exports = DeviceModel;