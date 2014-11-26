var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	name: String,
	email: String,
	contactNo: String,
	gender: String,
	currentLocation: {
		position: {
			latitude: String,
			longitude: String	
		},
		address: {
			location: String,
			street: String,
			city: String,
			country: String,
			zipcode: String
		}
	},
	books: Array,
	searchedLocations: Array,
});

var UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;