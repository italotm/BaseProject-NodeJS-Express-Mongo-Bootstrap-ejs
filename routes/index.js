var User = require('../models/user');

module.exports = function(app, passport){ 
	
	app.get("/", isLoggedIn, function(req, res){
		res.render('index');
	});
	
	app.get("/login", function(req, res){ 
		res.render('login'); 
	});
	
	app.post("/login/process", passport.authenticate('login', {
        successRedirect : '/index', 
        failureRedirect : '/login'
    })); 
	
	app.get("/index", isLoggedIn, function(req, res){
		res.render('index');
	});
	
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	
	app.get('/add_user', function(req, res) {
		res.render('add_user');
	});
	
	app.post('/add_user_process', function(req, res) {
		var newUser = new User();
		newUser.name = req.body.name;
		newUser.username = req.body.username;
		newUser.password = newUser.generateHash(req.body.password);
		newUser.save(newUser);
		
		res.redirect('/');
	});  
	
	app.get('/list_user', function(req, res) {
		User.find({}, function(err, resultQuery) {
		if(err){
			console.log(err);
		}else{
			res.render( 'list_user', {users : resultQuery});
		}
		});
	}); 
};

function isLoggedIn(req, res, next) {
    var userTemp = req.user;
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated()){
       return next();   
    }else{
        // if they aren't redirect them to the home page
        res.redirect('/login');
    }
}
