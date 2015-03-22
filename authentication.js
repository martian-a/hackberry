var request = require('request'),
url = require('url'),
htmlparser = require('htmlparser'),
fs = require('fs'),
qs = require('querystring'),
passport = require('passport'),
TwitterStrategy = require('passport-twitter').Strategy,
http = require('http');

/*
	Your app's Twitter credentials.
*/
var appKey = process.env['TWITTER_ALLERGEN_ALERTS_CONSUMER_KEY']
var appSecret = process.env['TWITTER_ALLERGEN_ALERTS_CONSUMER_SECRET']


/*
	Twitter URL for requesting an OAuth Token
	https://dev.twitter.com/oauth/reference/post/oauth/request_token
*/
var urlRequestToken = 'https://api.twitter.com/oauth/request_token';

var serverDomain = process.env['TWITTER_ALLERGEN_ALERTS_CALLBACK_DOMAIN'];
var serverPort = process.env['PORT'];

/*
	URL to which Twitter sends the OAuth credentials
*/ 
var urlCallback = 'http://' + serverDomain + '/request/token/access';

/*
	Twitter URL for requesting that the user authorise your app
	(requires an OAuth token, see above).
	https://dev.twitter.com/oauth/reference/get/oauth/authenticate
*/
var urlUserConfirmation = 'https://api.twitter.com/oauth/authenticate';

/*
	Twitter URL for retrieving the user's access token granted
	to your app once the user has authorised that app.
	https://dev.twitter.com/oauth/reference/post/oauth/access_token
*/
var urlAccessToken = 'https://api.twitter.com/oauth/access_token';


/*
	Configure Passport.
*/
passport.use(
	new TwitterStrategy(
		{
    		consumerKey: appKey,
    		consumerSecret: appSecret,
    		callbackURL: urlCallback
  		},
  		function(token, tokenSecret, profile, done) {
			console.log('test');    
    	}
	)
);


http.createServer(function (req, res) {

	setTimeout(
		function () {
	
	  		var url_parts = url.parse(req.url);
	  		console.log(url_parts.pathname);
	  
			switch(url_parts.pathname) {
				case '/request/token/oauth':
					passport.authenticate('twitter');
					console.log('First step complete');
					break;
				case '/request/token/access':
					console.log('Callback received');
					passport.authenticate(
						'twitter', 
						{ 
							successRedirect: '/success', 
							failureRedirect: '/login'
						}
					);
					return;				
				default:
					console.log("oh dear, 404");
			}  		
		
	    	res.writeHead(200, {'Content-Type': 'text/plain'});
	    	res.end('Hello World\n');
	    
		}, 
		2000
	);
}).listen(serverPort);


function requestOauthToken(res) {

	console.log('Requesting Oauth token.');
	
	var oauthRequestToken = { 
		callback: urlCallback, 
		consumer_key: appKey, 
		consumer_secret: appSecret
	};
	
	var urlUserConfirmationWithToken = '';
	
	request.post(
		{
			url: urlRequestToken, 
			oauth: oauthRequestToken
		}, 
		function (e, r, body) {
		
			console.log('Token requested.'); 			
	  		
	  		var responseTokenRequestBody = qs.parse(body);
	  		var oauthToken = responseTokenRequestBody.oauth_token;
	  		var oauthSecret = responseTokenRequestBody.oauth_token_secret;
	  		var callbackConfirmed = responseTokenRequestBody.oauth_callback_confirmed;	  	
	  		  		
	  		urlUserConfirmationWithToken = 
	  			urlUserConfirmation + 
	  			'?' + 
	  			qs.stringify({oauth_token: oauthToken}) + 
	  			'&' +
	  			'force_login=true' +
	  			'&' +
	  			'screen_name=UkGlutenAlerts'	  			
	  		;
	  
	  		console.log(urlUserConfirmationWithToken);
	    	
	    	res.writeHead(302, {'Location': urlUserConfirmationWithToken});
       		res.end();
	  		
	  	}
	  );	 
};

function requestAccessToken(responseUserConfirmationCallbackUrl, res) {

	console.log('Requesting access token.');
	
	console.log('Callback Params: ' + JSON.stringify(responseUserConfirmationCallbackUrl));
	var responseUserConfirmationCallbackParams = qs.parse(responseUserConfirmationCallbackUrl.query);
	
	var oauthVerifier = responseUserConfirmationCallbackParams.oauth_verifier;
	var oauthToken = responseUserConfirmationCallbackParams.oauth_token;
	  		
	var oauthRequestToken = { 
		consumer_key: appKey, 
		consumer_secret: appSecret, 
		token: oauthToken, 
		verifier: oauthVerifier
  	};
  	
  	console.log(JSON.stringify(oauthRequestToken));
	
	request.post(
		{
			url: urlRequestToken, 
			oauth: oauthRequestToken
		}, 
		function (e, r, body) {
		
			console.log('Access requested.'); 	
			
			console.log(body);		
	  		
	  		var responseTokenRequestBody = qs.parse(body);
	  		var accessToken = responseTokenRequestBody.oauth_token;
	  		var accessSecret = responseTokenRequestBody.oauth_token_secret;	  		  		  			  		
	    	
	    	res.writeHead(200, {'Content-Type': 'text/plain'});
	    	res.end('Token: ' + accessToken + '\n' + 'Secret: ' + accessSecret + '\n');
	  		
	  	}
	  );	 
};