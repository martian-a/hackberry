var Twit = require('twit'),
TwitterPublishingApp = require('./twitterPublishingApp');

function Feed(feedName, feedMatchExpressions) {
	this.name = 'anonymous';
	this.enabled = false;
	this.twitterAccount = null;
	this.matchExpressions = new Array();
	
	if (feedName != null && feedName != '') {
		this.name = feedName;
	};
	
	if (feedMatchExpressions != null && feedMatchExpressions != 'undefined') {
		for (i in feedMatchExpressions) {
			this.matchExpressions.push(feedMatchExpressions[i]);
		}	
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

Feed.prototype.getTotalMatchExpressions = function() {
	return this.matchExpressions.length;
};

module.exports = Feed;