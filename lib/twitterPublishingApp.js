function TwitterPublishingApp(appToken, appSecret) {
	this.key = appToken;
	this.secret = appSecret;
	this.feeds = new Array();
}

TwitterPublishingApp.prototype.addFeed = function(feed) {
	this.feeds.push(feed);
	console.log('Feed added: ' + feed.keywords[0]);
};

TwitterPublishingApp.prototype.getTotalFeeds = function() {
	return this.feeds.length;
};

module.exports = TwitterPublishingApp;