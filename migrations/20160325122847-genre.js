'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
	db.createTable('genres');
	db.insert('genres', [{
		'name': 'Fiction',
		'description': ''
	},
	{
		'name': 'Non-Fiction',
		'description': ''
	},{
		'name': 'Science Fiction',
		'description': ''
	},
	{
		'name': 'Drama',
		'description': ''
	},{
		'name': 'Satire',
		'description': ''
	},{
		'name': 'Action',
		'description': ''
	},{
		'name': 'Adventure',
		'description': ''
	},{
		'name': 'Romance',
		'description': ''
	},{
		'name': 'Mystery',
		'description': ''
	},{
		'name': 'Horror',
		'description': ''
	},{
		'name': 'Fantasy',
		'description': ''
	},{
		'name': 'Biography',
		'description': ''
	},{
		'name': 'Autobiographies',
		'description': ''
	},{
		'name': 'Crime',
		'description': ''
	},{
		'name': 'Fiction',
		'description': ''
	},{
		'name': 'Mythology',
		'description': ''
	},{
		'name': 'Detective',
		'description': ''
	},{
		'name': 'Humour',
		'description': ''
	},{
		'name': 'Health',
		'description': ''
	},{
		'name': 'Self Help',
		'description': ''
	},{
		'name': 'Guide',
		'description': ''
	},{
		'name': 'Travel',
		'description': ''
	},{
		'name': 'Children',
		'description': ''
	},{
		'name': 'Religion',
		'description': ''
	},{
		'name': 'Science',
		'description': ''
	},{
		'name': 'History',
		'description': ''
	},{
		'name': 'Math',
		'description': ''
	},{
		'name': 'Anthology',
		'description': ''
	},{
		'name': 'Poetry',
		'description': ''
	},{
		'name': 'Encyclopedias',
		'description': ''
	},{
		'name': 'Dictionaries',
		'description': ''
	},{
		'name': 'Comics',
		'description': ''
	},{
		'name': 'Art',
		'description': ''
	},{
		'name': 'Cookbooks',
		'description': ''
	},{
		'name': 'Journals',
		'description': ''
	},{
		'name': 'Prayer Books',
		'description': ''
	},{
		'name': 'Series',
		'description': ''
	},{
		'name': 'Trilogy',
		'description': ''
	},{
		'name': 'Tragedy',
		'description': ''
	},{
		'name': 'Fable',
		'description': ''
	},{
		'name': 'Fanfiction',
		'description': ''
	},{
		'name': 'Legend',
		'description': ''
	},{
		'name': 'Short Story',
		'description': ''
	},{
		'name': 'Tall Tale',
		'description': ''
	},{
		'name': 'Realistic Fiction',
		'description': ''
	},{
		'name': 'Western',
		'description': ''
	},{
		'name': 'Metafiction',
		'description': ''
	},{
		'name': 'Folklore',
		'description': ''
	},{
		'name': 'Memoir',
		'description': ''
	},{
		'name': 'Tragic Comedy',
		'description': ''
	},{
		'name': 'Political Thriller',
		'description': ''
	}], callback);
};

exports.down = function(db, callback) {
	db.dropTable('genres', callback);
};
