let
	Book = require('./book.model');

let controller = {
	get: function(req, res) {
		let __paginatePayload;

    __paginatePayload = {
      limit: 10
    };

    if(req.query.limit){
      __paginatePayload.limit = parseInt(req.query.limit, 10);
    }

    if(req.query.page){
      __paginatePayload.page = parseInt(req.query.page, 10);
    } else if(req.query.offset){
      __paginatePayload.offset = parseInt(req.query.offset, 10);
    }

    Book.paginate({}, __paginatePayload).then(function(results){
      let __results = Object.assign({}, results , {
        books: results.docs
      });

      delete __results.docs;

      res.status(200).send(__results);
    }, function(err){

    });
    
	},
	
	getById: function(req, res) {

	},

	create: function(req, res) {

	}
};

module.exports = controller;