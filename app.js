
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
var mongoose = require('mongoose');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.engine( 'ejs', engine );
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());

app.use(session({ secret: 'mySecret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

mongoose.connect('mongodb://localhost/my_db');

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
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


