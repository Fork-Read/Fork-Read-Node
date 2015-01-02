var mongoose = require('mongoose');

var adminSchema = mongoose.Schema({
	username: String,
	password: String,
	isAuthenticated: Boolean
});

adminSchema.methods.validPassword = function(password){
		if(this.password === password){
			this.isAuthenticated = true;
			return true;
		}
		else{
			return false;
		}
	}

var AdminModel = mongoose.model('Admin', adminSchema);

module.exports = AdminModel;