var session = require('express-session');

function User() {
	
	this.provider = null;
	this.id = null;
	this.username = null;
	this.displayName = "";
	this.token = null;
	this.secret = null;
	this.session = null;
	
}


/*
 * Setters
 */

User.prototype.setProvider = function(providerId) {
	this.provider = providerId;
	return this.provider;
}

User.prototype.setId = function(userId) {
	this.id = userId;
	return this.id;
}

User.prototype.setUsername = function(usernameIn) {
	this.username = usernameIn;
	return this.username;
}

User.prototype.setDisplayName = function(userDisplayName) {
	this.displayName = userDisplayName;
	return this.displayName;
}

User.prototype.setToken = function(userToken) {
	this.token = userToken;
	return this.token;
}

User.prototype.setSecret = function(userSecret) {
	this.secret = userSecret;
	return this.secret;
}

User.prototype.setSession = function(sessionIn) {
	this.session = sessionIn;
	return this.session;
}

/*
 * Getters
 */


User.prototype.getProvider = function() {
	return this.provider;
}

User.prototype.getId = function() {
	return this.id;
}

User.prototype.getUsername = function() {
	return this.username;
}

User.prototype.getDisplayName = function() {
	return this.displayName;
}

User.prototype.getToken = function() {
	return this.token;
}

User.prototype.getSecret = function() {
	return this.secret;
}

User.prototype.getSession = function() {
	var session = null;
	if (this.session == null) {
		session = this.setSession(this.createSession());
	} else {
		session = this.session;	
	}	
	console.log("User session is set.");
	console.log(session);
	return session;
}

/*
 * Methods
 */

User.prototype.err = function(error) {
	console.log(error);
} 

User.prototype.fail = function(infoIn) {
	console.log("FAIL!");
	console.log(infoIn);
} 

User.prototype.success = function(userIn, infoIn) {
	console.log("WIN!");
} 

User.prototype.createSession = function() {
	var temp = new session(
		{
			name: 'my_cookie',
			secret: 'cookie_secret',
			proxy: true,
			resave: true,
			saveUninitialized: true
		}
	);
	return temp;
}

module.exports = User;