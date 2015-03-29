var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

function Authenticator(serverIn) {
	
	this.server = serverIn;	
	this.logger = new morgan('combined');
	
}


Authenticator.prototype.configure = function(user) {
		
	this.server.use(this.logger);
	this.server.use(cookieParser());
	this.server.use(bodyParser.json());
	this.server.set('view engine', 'ejs');
	
	this.server.use(user.getSession());
	this.server.use(passport.initialize());
	this.server.use(passport.session());
	this.server.use(flash());
	
	this.setRoutes(user);

}

Authenticator.prototype.setRoutes = function(user) {
	
	var self = this;
	
	this.server.all(
		'*', 
		function(req, res, next) {
			console.log(req.url);
			next();
		}
	);
	
	this.server.get(
			'/auth/twitter', 
			passport.authenticate('twitter')
	);

	this.server.get(
			'/auth/twitter/callback', 
			passport.authenticate(
					'twitter', 
					{
						successRedirect: '/user/profile',
			            failureRedirect: '/login' 
			        }
			)
	);
	
	this.server.get(
		'/user/profile',
		function(req, res) {
			res.send('Hello!\n' + JSON.stringify(user));
		}
	);
	
	this.server.get(
		'/',
		function(req, res) {
			res.send('Hello World!')
		}
	);
	
	this.server.get(
		'/login',
		function(req, res) {
			res.send('Please login.')
		}
	);

}


Authenticator.prototype.authenticate = function(user, providerName, appKey, appSecret, port) {

	var self = this;
	var server = this.server;

	user.setProvider(providerName);
	
	console.log("Authenticating with " + user.getProvider());
	
	passport.use(
		new TwitterStrategy(
			{
				consumerKey: appKey,
				consumerSecret: appSecret,
				callbackURL: "http://localhost:" + port + "/auth/" + providerName + "/callback"
			},
			
			function(tokenId, tokenSecret, profile, done) {
				
				console.log("Token: " + tokenId + "\nSecret: " + tokenSecret + "\nProfile:\n\n" + JSON.stringify(profile) + "\n\nDone: " + done);										
				
				console.log(user.getProvider());				
				console.log(user.setId(profile.id));
				console.log(user.setUsername(profile.username));
				console.log(user.setDisplayName(profile.displayName));
				console.log(user.setToken(tokenId));
				console.log(user.setSecret(tokenSecret));
															
				return done(null, user);					
				
			}
		)
	);	
	
	passport.serializeUser(
		function(user, done) {
			done(null, user.id);
		}
	);

	passport.deserializeUser(
		function(id, done) {
			done(null, self);
		}
	);
	
	self.configure(user);	
	
	server.listen(port);
		
	console.log('The magic happens on port ' + port);
	
}

module.exports = Authenticator;