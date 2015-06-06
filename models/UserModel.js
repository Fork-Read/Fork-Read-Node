var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: String,
    email: String,
    contactNo: String,
    pictureUrl: String,
    gender: String,
    homeLocation: {
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
    },
    isActive: Boolean, // True/False to decide if the user is deleted or not
});

var UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;