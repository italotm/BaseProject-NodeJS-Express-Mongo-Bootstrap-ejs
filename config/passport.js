var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {
	
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    }, function(req, username, password, done) {
			// find a user whose email is the same as the forms email
			// we are checking to see if the user trying to login already exists
			User.findOne({ 'username' :  username }, function(err, user) {
				// if there are any errors, return the error
				if (err) return done(err);
				// Nome de usuário não existe, logar o erro & redirecione de volta
				if (!user){
					console.log('Usuário não encontrado para usuário '+username);
					return done(null, false);
				}
				// Usuário existe mas a senha está errada, logar o erro
				if (!user.validPassword(password)){
					console.log('Senha Inválida');
					return done(null, false);
				}
				// Tanto usuário e senha estão corretos, retorna usuário através 
				// do método done, e, agora, será considerado um sucesso
				return done(null, user);
			});    

    }));

};
