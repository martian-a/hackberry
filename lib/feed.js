var Twit = require('twit'),
TwitterPublishingApp = require('./twitterPublishingApp');

function Feed(feedKeywords) {
	this.enabled = false;
	this.twitterAccount = null;
	this.keywords = [];
	
	if (feedKeywords != null) {
		if (feedKeywords.constructor === Array) {
			this.keywords = feedKeywords;
		} else {
			this.keywords = new Array(feedKeywords);
		};
	};		
}

Feed.prototype.initTwitter = function(publishingApp, token, secret) {

	this.twitterAccount = new Twit(
		{
			consumer_key: publishingApp.key,
			consumer_secret: publishingApp.secret,
			access_token: token,
			access_token_secret: secret
		}
	);
	this.enabled = true;
}

Feed.prototype.getTotalKeywords = function() {
	return this.keywords.length;
};

module.exports = Feed;