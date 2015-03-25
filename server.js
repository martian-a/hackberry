/*
    Import modules.
 */
var dom = require('xmldom').DOMParser;
var Feed = require('./lib/feed');
var fs = require('fs');
var htmlparser = require('htmlparser');
var http = require('http');
var pgsync = require('pg-sync');
var request = require('request');
var TwitterPublishingApp = require('./lib/twitterPublishingApp');
var url = require('url');
var xmlentities = require("xml-entities");
var xpath = require('xpath');

console.log('Starting server on port ' + process.env.PORT);

/*
	Listen for http requests and redirect
	them to the generic twitter feed.
	
	In addition to providing something more
	interesting to read, this helps to stop 
	Heroku complaining that the (web) app 
	hasn't bound to the port it's provided.
*/
var serverPort = process.env['PORT'];
var server = http.createServer().listen(serverPort);

server.on('error', function(e){
	console.log(e);
});

server.on('request', function(req, res){

	setTimeout(
		function () {
	
	  		var url_parts = url.parse(req.url);
	  		console.log('\nHTTP REQUEST: ' + url_parts.pathname + '\n');	  		
		
			// Redirect all requests to the generic twitter feed.
	    	res.writeHead(302, {'Location': 'https://twitter.com/AllergenAlerts/'});
       		res.end();
	    
		}, 
		2000
	);
			
});

server.listen(serverPort);