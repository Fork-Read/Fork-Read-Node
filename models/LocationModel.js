var mongoose = require('mongoose');

var locationSchema = mongoose.Schema({
    user_id: String,
    position: {
        latitide: String,
        longitude: String
    },
    address: {
        location: String,
        street: String,
        city: String,
        state: String,
        country: String,
        zipcode: String,
        formatted_address: String
    },
    isHome: Boolean
});

var LocationModel = mongoose.model('Location', locationSchema);

module.exports = LocationModel;