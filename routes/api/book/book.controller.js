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
		let isISBN = req.query.is_isbn === 'true';
		let bookID = req.params.id;
		let __payload = {};

		if(!bookID){
			helpers.badRequest(res, 'Missing parameters');
		}

		if(isISBN){

			__payload['isbn'] = req.params.id;
		} else {
			
			__payload['_id'] = req.params.id;
		}

		console.log(__payload);

		Book.findOne(__payload).then(function(book){
			res.status(200).json(book)
		}, function(err){
			helpers.badRequest(res, err.message);
		});

	},

	create: function(req, res) {

		if(!req.body.isbn || !req.body.title){
			helpers.badRequest(res, 'Parameters Missing');
		}

		Book.findOne({
			'isbn': req.body.isbn
		}).then(function(book){
			
			if(book){
				helpers.badRequest(res, 'Book already exists in the system');
			} else {

				Book.create(req.body).then(function(book){
					res.status(201).json(book);
				});

			}
		});

	}
};

module.exports = controller;