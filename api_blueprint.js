{
  'users': {
    'GET /api/users': {
      'desc': 'Returns list of all users',
      'response': '200 application/json',
      'data': {
        'users': [{}, {}, {}]
      }
    },

    'GET /api/users/:id': {
      'desc': 'Returns user with id',
      'response': '200 application/json',
      'data': {}
    },

    'POST /api/users': {
      'desc': 'Creates a new user and returns it',
      'response': '201 application/json',
      'data': {}
    },

    'PUT /api/users/:id': {
      'desc': 'Updates specific user and returns updated data',
      'response': '200 application/json',
      'data': {}
    },

    'DELETE /api/users/:id': {
      'desc': 'Deletes a specific user and returns it. Does a soft delete',
      'response': '200 application/json',
      'data': {}
    }
  },

  'books': {
    'GET /api/books': {
      'desc': 'Returns list of all books',
      'response': '200 application/json',
      'data': {
        'books': [{}, {}, {}]
      }
    },

    'GET /api/books/:id': {
      'desc': 'Returns book with id',
      'response': '200 application/json',
      'data': {}
    },

    'POST /api/books': {
      'desc': 'Creates a new book and returns it. Supports batch request',
      'response': '201 application/json',
      'data': {}
    },

    'PUT /api/books/:id': {
      'desc': 'Updates specific book and returns updated data',
      'response': '200 application/json',
      'data': {}
    },

    'DELETE /api/books/:id': {
      'desc': 'Deletes a specific book and returns it. Does a soft delete',
      'response': '200 application/json',
      'data': {}
    }
  }
}