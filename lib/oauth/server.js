var express  = require('express');
var user = require('./user.js');
var authenticator = require('./authenticator.js');

var port = process.env.PORT || 8000;

var twitterUser = new user();
var server = new express();
var gatekeeper = new authenticator(server);
gatekeeper.authenticate(twitterUser, 'twitter', process.env.TWITTER_KOOLIMARA_APP_TOKEN, process.env.TWITTER_KOOLIMARA_APP_SECRET, port);