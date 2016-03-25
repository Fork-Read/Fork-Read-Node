var
  express = require('express'),
  path = require('path'),
  favicon = require('serve-favicon'),
  bodyParser = require('body-parser'),
  http = require('http'), // For serving a basic web page.
  mongoose = require("mongoose"),
  elasticsearch = require('elasticsearch'),
  swagger = require('swagger-express'),
  cors = require('cors'),
  morgan = require('morgan');

// Load the environment variables
require('dotenv').config({
  path: './parameters.env'
});

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(process.env.MONGO_URL, function (err, res) {
  if (err) {
    console.log('ERROR connecting to: ' + process.env.MONGO_URL + '. ' + err);
  } else {
    console.log('Succeeded connected to: ' + process.env.MONGO_URL);
  }
});

var client = new elasticsearch.Client({
  host: process.env.ELASTICSEARCH,
  log: 'trace'
});

var
  routes = require('./routes/index'),
  user = require('./routes/api/user/index'),
  books = require('./routes/api/books/index'),
  book_own = require('./routes/api/book-own/index'),
  book_like = require('./routes/api/book-like/index'),
  book_wish = require('./routes/api/book-wishlist/index'),
  book_read = require('./routes/api/book-read/index'),
  authenticate = require('./routes/api/authentication/index'),
  genre = require('./routes/api/genre/index');

var swaggerConfig = {
  apiVersion: '0.0.1',
  swaggerVersion: '1.0',
  swaggerURL: '/swagger',
  swaggerJSON: '/api-docs.json',
  swaggerUI: './public/swagger/',
  basePath: 'http://localhost:3000',
  apis: [
    './routes/api/user/index.js',
    './routes/api/books/index.js',
    './routes/api/book-own/index.js',
    './routes/api/book-like/index.js',
    './routes/api/book-wishlist/index.js',
    './routes/api/authentication/index.js'
  ],
  middleware: function (req, res) {}
};

var app = express();

if (app.get('env') === 'production') {
  swaggerConfig.basePath = 'http://www.forkread.com';
}

app.use(function (req, res, next) {
  req.elasticClient = client;
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// App Plugins
app.use(morgan(':remote-addr - :remote-user [:date[web]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(swagger.init(app, swaggerConfig));

// Routes Used
app.use('/', routes);
app.use('/api/user', user);
app.use('/api/books/own', book_own);
app.use('/api/books/like', book_like);
app.use('/api/books/wishlist', book_wish);
app.use('/api/books/read', book_read);
app.use('/api/books', books);
app.use('/api/authentication', authenticate);
app.use('/api/genre', genre);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  if (app.get('env') === 'development') {
    if (err) {
      throw err
    } else {
      console.error(err);
    }
  }
});

module.exports = app;