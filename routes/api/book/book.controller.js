let
	Book 			= require('./book.model'),
	helpers 	= require('../helpers');

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
		let bookID = req.params.id;

		if(!bookID){
			helpers.badRequest('Missing parameters');
		}

		Book.findOne({
			'_id': bookID
		}).then(function(book){
			res.status(200).json(book)
		});

	},

	create: function(req, res) {

		Book.findOne({
			'isbn': req.body.isbn
		}).then(function(book){
			
			if(book){
				helpers.badRequest('Book already exists in the system');
			} else {

				Book.create(req.body).then(function(book){
					res.status(201).json(book);
				});

			}
		});

	}
};

module.exports = controller;