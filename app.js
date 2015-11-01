var
    express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    http = require('http'), // For serving a basic web page.
    mongoose = require("mongoose"),
    session = require('express-session'),
    elasticsearch = require('elasticsearch'),
    swagger = require('swagger-express'),
    cors = require('cors');

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
var uristring = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost:27017/snickers';

// The http server will listen to an appropriate port, or default to port 5000.
var theport = process.env.PORT || 5000;

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
    if (err) {
        console.log('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log('Succeeded connected to: ' + uristring);
    }
});

var connectionString = process.env.SEARCHBOX_URL;

// Use local elastic search if connection string not found
if (!connectionString) {
    connectionString = 'localhost:9200';
}

var client = new elasticsearch.Client({
    host: connectionString,
    log: 'trace'
});

var
    routes = require('./routes/index'),
    user = require('./routes/api/user/index'),
    books = require('./routes/api/books/index'),
    book_own = require('./routes/api/book-own/index'),
    book_like = require('./routes/api/book-like/index'),
    book_wish = require('./routes/api/book-wishlist/index');

var swaggerConfig = {
    apiVersion: '0.0.1',
    swaggerVersion: '1.0',
    swaggerURL: '/swagger',
    swaggerJSON: '/api-docs.json',
    swaggerUI: './public/swagger/',
    basePath: 'http://localhost:3000',
    apis: ['./routes/api/user/index.js', './routes/api/books/index.js', './routes/api/book-own/index.js', './routes/api/book-like/index.js', './routes/api/book-wishlist/index.js'],
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
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(cors());
app.use(swagger.init(app, swaggerConfig));

// Routes Used
app.use('/', routes);
app.use('/api/user', user);
app.use('/api/books', books);
app.use('/api/own', book_own);
app.use('/api/like', book_like);
app.use('/api/wishlist', book_wish);

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