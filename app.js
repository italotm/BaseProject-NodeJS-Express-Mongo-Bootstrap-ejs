
/**
 * Module dependencies.
 */

var express = require('express');
var session = require('express-session');
var passport = require('passport');
var http = require('http');
var path = require('path');
var engine  = require( 'ejs-locals' );

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var bson = require('bson/browser_build/bson');
var mongoose = require('mongoose');

var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.engine( 'ejs', engine );
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// app.use(express.favicon());
// app.use(express.json());
// app.use(express.urlencoded());
// app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'));
// app.use(express.cookieParser());
// app.use(express.bodyParser());

// app.use(session({ secret: 'mySecret' }));
app.use(session({ secret: 'mySecret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
// app.use(app.router);

app.use(favicon(__dirname + '/public/images/favicon.ico'));
// app.use(favicon(options.favicon));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser())

mongoose.connect('mongodb://localhost/my_db');

// development only
if ('development' == app.get('env')) {
  // app.use(express.errorHandler());
  app.use(errorHandler());
}

require('./config/passport')(passport);
require('./routes')(app, passport);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


//Insert first user
var User = require('./models/user');
User.findOne({username : "admin"}, function (err, user) {
	if (!user) {
		var newUser = new User();
		newUser.name = "nome";
		newUser.username = "admin";
		newUser.password = newUser.generateHash("123456");
		newUser.save(function (err) {
			if (err) {
				console.log(err)
			} else {
				console.log("sucesso")
			}
		});
	}
});		


