'use strict';

let express, path, favicon, bodyParser, http, mongoose, elasticsearch, morgan, cors;
let client, app;

let routes, user, authenticate, genre, user_genre;


express           = require('express');
path              = require('path');
favicon           = require('serve-favicon');
bodyParser        = require('body-parser');
http              = require('http'); // For serving a basic web page.
mongoose          = require("mongoose");
elasticsearch     = require('elasticsearch');
morgan            = require('morgan');
cors              = require('cors');


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

client = new elasticsearch.Client({
  host: process.env.ELASTICSEARCH,
  log: 'trace'
});


routes          = require('./routes/index'),
user            = require('./routes/api/user'),
authenticate    = require('./routes/api/authentication'),
genre           = require('./routes/api/genre'),
user_genre      = require('./routes/api/user_genre');


app = express();

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


// Routes Used
app.use('/'                     , routes);
app.use('/api/user'             , user);
app.use('/api/authentication'   , authenticate);
app.use('/api/genre'            , genre);
app.use('/api/user_genre'       , user_genre);


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