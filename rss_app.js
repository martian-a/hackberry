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

var DISABLE_PUBLISHING = true;


/* 
	Data source:
	An RSS feed published by the Food Standards Agency.
*/
var rssUrl = 'http://www.food.gov.uk/news-updates/allergynews-rss';

/*
    Database (postgres)
 */
var databaseUrl = process.env['DATABASE_URL'];
var client = new pgsync.Client();


/*
	Specify how frequently the RSS feed should be checked
	(milliseconds)
*/
var oneMinute = (1000 * 60);
var intervalLength = (1 * oneMinute);


/*
	== Feeds/Allergens ==
	
	- Generic
	- Celery
	- Crustaceans
	- Egg
	- Fish
	- Gluten
	- Lupin
	- Milk
	- Moluscs
	- Mustard
	- Nuts
	     - Peanuts (ground nuts)
	     - Tree nuts
	- Sesame Seeds
	- Soya
	- Sulphites

*/

var twitterApp = new TwitterPublishingApp(
	process.env['TWITTER_ALLERGEN_ALERTS_CONSUMER_KEY'],
	process.env['TWITTER_ALLERGEN_ALERTS_CONSUMER_SECRET']
);

/*
	Twitter Account: Generic Allergen Alerts
	https://twitter.com/allergenalerts
*/
var allAlerts = new Feed('UK Allergen Alerts');
allAlerts.initTwitter(
	twitterApp, 
	process.env['TWITTER_ALLERGEN_ALERTS_ACCESS_TOKEN'], 
	process.env['TWITTER_ALLERGEN_ALERTS_ACCESS_SECRET']
);


/*
	Twitter Account: UK Celery Alerts
	TODO: https://twitter.com/ukceleryalerts
*/
var celeryAlerts = new Feed('UK Celery Alerts', new Array("\\bcelery\\b", "\\bceleriacs?\\b"));
twitterApp.addFeed(celeryAlerts);
celeryAlerts.initTwitter(
	twitterApp,
	process.env['TWITTER_CELERY_ALERTS_ACCESS_TOKEN'], 
	process.env['TWITTER_CELERY_ALERTS_ACCESS_SECRET']
);


/*
	Twitter Account: UK Crustacean Alerts
	TODO: https://twitter.com/ukcrustaceanalerts
*/
var crustaceanAlerts = new Feed('UK Crustacean Alerts', new Array('\\bcrustaceans?\\b', "\\bshellfish\\b", "\\bcrabs?\\b", "\\bcrayfish\\b", "\\bprawns?\\b", "\\bshrimp\\b", "\\bscampi\\b"));
twitterApp.addFeed(crustaceanAlerts);
crustaceanAlerts.initTwitter(
	twitterApp,
	process.env['TWITTER_CRUSTACEAN_ALERTS_ACCESS_TOKEN'], 
	process.env['TWITTER_CRUSTACEAN_ALERTS_ACCESS_SECRET']
);


/*
	Twitter Account: UK Egg Alerts
	https://twitter.com/UkEggAlerts
*/
var eggAlerts = new Feed("UK Egg Alerts", new Array("\\beggs?\\b"));
twitterApp.addFeed(eggAlerts);
eggAlerts.initTwitter(
	twitterApp,
	process.env['TWITTER_EGG_ALERTS_ACCESS_TOKEN'], 
	process.env['TWITTER_EGG_ALERTS_ACCESS_SECRET']
);


/*
	Twitter Account: UK Fish Alerts
	https://twitter.com/UkFishAlerts
*/
var fishAlerts = new Feed("UK Fish Alerts", new Array("\\bfish\\b"));
twitterApp.addFeed(fishAlerts);
fishAlerts.initTwitter(
	twitterApp,
	process.env['TWITTER_FISH_ALERTS_ACCESS_TOKEN'],
	process.env['TWITTER_FISH_ALERTS_ACCESS_SECRET']
);


/*
	Twitter Account: UK Gluten Alerts
	https://twitter.com/ukglutenalerts
*/
var glutenAlerts = new Feed("UK Gluten Alerts", new Array("\\bgluten"));
twitterApp.addFeed(glutenAlerts);
glutenAlerts.initTwitter(
	twitterApp,
	process.env['TWITTER_GLUTEN_ALERTS_ACCESS_TOKEN'], 
	process.env['TWITTER_GLUTEN_ALERTS_ACCESS_SECRET']
);


/*
	Twitter Account: UK Lupin Alerts
	TODO: https://twitter.com/uklupinalerts
*/
var lupinAlerts = new Feed("UK Lupin Alerts", new Array("\\blupins?\\b"));
twitterApp.addFeed(lupinAlerts);
lupinAlerts.initTwitter(
	twitterApp,
	process.env['TWITTER_LUPIN_ALERTS_ACCESS_TOKEN'], 
	process.env['TWITTER_LUPIN_ALERTS_ACCESS_SECRET']
);


/*
	Twitter Account: UK Milk Alerts
	https://twitter.com/UkMilkAlerts
*/
var milkAlerts = new Feed("UK Milk Alerts", new Array("\\bmilk\\b"));
twitterApp.addFeed(milkAlerts);
milkAlerts.initTwitter(
	twitterApp,
	process.env['TWITTER_MILK_ALERTS_ACCESS_TOKEN'], 
	process.env['TWITTER_MILK_ALERTS_ACCESS_SECRET']
);


/*
	Twitter Account: UK Mollusc Alerts
	TODO: https://twitter.com/molluscalerts
*/
var molluscAlerts = new Feed("UK Mollusc Alerts", new Array("\\bmolluscs?\\b", "\\bsnails?\\b", "\\bsquid", "\\bwhelks?\\b"));
twitterApp.addFeed(molluscAlerts);
molluscAlerts.initTwitter(
	twitterApp,
	process.env['TWITTER_MOLLUSC_ALERTS_ACCESS_TOKEN'], 
	process.env['TWITTER_MOLLUSC_ALERTS_ACCESS_SECRET']
);


/*
	Twitter Account: UK Mustard Alerts
	TODO: https://twitter.com/ukmustardalerts
*/
var mustardAlerts = new Feed("UK Mustard Alerts", new Array("\\bmustard"));
twitterApp.addFeed(mustardAlerts);
mustardAlerts.initTwitter(
	twitterApp,
	process.env['TWITTER_MUSTARD_ALERTS_ACCESS_TOKEN'], 
	process.env['TWITTER_MUSTARD_ALERTS_ACCESS_SECRET']
);


/*
	Twitter Account: UK Nut Alerts
	https://twitter.com/UkNutAlerts
*/
var treeNutMatchExpressions = new Array("\\b[^pea]?nuts?\\b", "\\bcashews?\\b", "\\balmonds?\\b");
var nutAlerts = new Feed("UK Nut Alerts", new Array("\\bpeanuts?").concat(treeNutMatchExpressions));
twitterApp.addFeed(nutAlerts);
nutAlerts.initTwitter(
	twitterApp,
	process.env['TWITTER_NUT_ALERTS_ACCESS_TOKEN'], 
	process.env['TWITTER_NUT_ALERTS_ACCESS_SECRET']
);


/*
	Twitter Account: UK Peanut Alerts
	TODO: https://twitter.com/ukpeanutalerts
*/
var peanutAlerts = new Feed("UK Peanut Alerts", new Array("\\bpeanuts?\\b"));
twitterApp.addFeed(peanutAlerts);
peanutAlerts.initTwitter(
	twitterApp,
	process.env['TWITTER_PEANUT_ALERTS_ACCESS_TOKEN'], 
	process.env['TWITTER_PEANUT_ALERTS_ACCESS_SECRET']
);


/*
	Twitter Account: UK Sesame Seed Alerts
	TODO: https://twitter.com/uksesamealerts
*/
var sesameAlerts = new Feed("UK Sesame Alerts", new Array("\\bsesame\\b"));
twitterApp.addFeed(sesameAlerts);
sesameAlerts.initTwitter(
	twitterApp,
	process.env['TWITTER_SESAME_SEED_ALERTS_ACCESS_TOKEN'], 
	process.env['TWITTER_SESAME_SEED_ALERTS_ACCESS_SECRET']
);


/*
	Twitter Account: UK Soya Alerts
	https://twitter.com/UkSoyaAlerts
*/
var soyaAlerts = new Feed("UK Soya Alerts", new Array("\\bsoya\\b"));
twitterApp.addFeed(soyaAlerts);
soyaAlerts.initTwitter(
	twitterApp,
	process.env['TWITTER_SOYA_ALERTS_ACCESS_TOKEN'], 
	process.env['TWITTER_SOYA_ALERTS_ACCESS_SECRET']
);


/*
	Twitter Account: UK Sulphites Alerts
	https://twitter.com/ukso2alerts
*/
var sulphiteAlerts = new Feed("UK Sulphite Alerts", new Array("\\bsulphites?\\b", "\\bsulphur"));
twitterApp.addFeed(sulphiteAlerts);
sulphiteAlerts.initTwitter(
	twitterApp,
	process.env['TWITTER_SULPHITE_ALERTS_ACCESS_TOKEN'], 
	process.env['TWITTER_SULPHITE_ALERTS_ACCESS_SECRET']
);


/*
	Twitter Account: UK Tree Nut Alerts
	https://twitter.com/UkTreeNutAlerts
*/
var treeNutAlerts = new Feed("UK Tree Nut Alerts", treeNutMatchExpressions);
twitterApp.addFeed(treeNutAlerts);
treeNutAlerts.initTwitter(
	twitterApp,
	process.env['TWITTER_TREE_NUT_ALERTS_ACCESS_TOKEN'], 
	process.env['TWITTER_TREE_NUT_ALERTS_ACCESS_SECRET']
);

console.log('Total feeds: ' + twitterApp.getTotalFeeds());
console.log('App initialisation complete.\n');


// Needed for RSS parsing
var handler = new htmlparser.RssHandler();
var parser = new htmlparser.Parser(handler);


// function to sort dates
function compareDates(a, b) {

    var aDate = new Date(a.pubDate);
    var bDate = new Date(b.pubDate);

    if (aDate < bDate)
        return -1;
    if (aDate > bDate)
        return 1;
    return 0;
}

/**
 * Retrieve the most recent date that's currently in the database.
 */
function getLatestPostedItemDate() {
	
	// Open a connection to the database.
	client.connect(databaseUrl);
    client.setAutoCommit('on');
	
	/*
	    Execute a query to retrive the most recent date value stored in
	    the published table. (1 record).
	 */ 
	var result = client.query("SELECT published FROM updates ORDER BY published DESC LIMIT 1");
	
	// Convert the database result into a date object.
	var dateTimeObjectOfMostRecentTweet;
	if (result == null || result.length == 0) {
		dateTimeObjectOfMostRecentTweet = new Date('01/01/2000');
	} else {
		dateTimeObjectOfMostRecentTweet = new Date(result[0].published);
	}
	
	// Close the connection to the database.
	client.disconnect();
	
	console.log('The timestamp for the most recently tweeted alert from the previous feed check is:\n' + dateTimeObjectOfMostRecentTweet.toString());		
	
	return dateTimeObjectOfMostRecentTweet;
	  
}


/**
 * Insert the date (inc. timestamp) supplied into the database.
 * Returns the most recentl date that's currently in the database.
 * 
 * Given that we're only interested in recording a single point in 
 * time, a database is overkill really. However, it's free and,
 * most relevant, a persistent means of storing data on Heroku.
 */
function setLatestPostedItemDate(dateTimeString) {
    
    // Open a connection to the database
    client.connect(databaseUrl);
    client.setAutoCommit('on');
    
	/*
	    Formulate a query to insert the timestamp supplied
	    into the database.
	*/ 
	var statement = "INSERT INTO updates (published) VALUES ('" + new Date(dateTimeString).toUTCString() + "')";
	
	// Execute the query.
	client.query(statement);
	
	// Close the database connection
    client.disconnect();
	
	// Return the most recent timestamp currently in the database
	return getLatestPostedItemDate();	
	  
}

// post item to twitter
function publishToTwitter(feed, alert){
    
    console.log('Tweeting to ' + feed.name);
    
    /*
    	Check whether the title needs to be truncated
    	in order to keep the total length of the tweet
    	(including the link) to no more than 140 chars.
    	
    	Twitter will automatically shorten the link to  
    	no more than 23 characters.
    	
    	If the title needs to be shortened, add an 
    	elipse character to the end of what remains,
    	to indicate that there is more text than is
    	shown.
     */
    var title = alert.title;
    var linkLength = 23;
    if (alert.link.length < linkLength) {
    	linkLength = alert.link.length;
    }
    
    if ((linkLength + 1 + title.length) > 140) {
    	title = title.substring(0, (138 - linkLength)) + '…';
    	console.log('Title shortened from:\n     ' + alert.title + '\nto:\n     ' + title);
    }
    
    // Construct the body of the tweet.
    var tweet = title + ' ' + alert.link;
    
    if (DISABLE_PUBLISHING != true) {

        // Send the tweet.
        feed.twitterAccount.post('statuses/update', { status: tweet }, function(err, data, response) {
    		     if (err) {
    			 	console.log(err);
    			 	console.log(tweet);
    			 };
    	});
	
	}
    
    /*
		Update the local record of the most recently
		tweeted alert.
    */
    setLatestPostedItemDate(alert.pubDate);    
    
}

/*
	Check the FSA RSS feed and publish new items on Twitter.
*/
function getNewAlerts() {

	console.log('\nChecking for new items.');

	var latestPostedItemDate = getLatestPostedItemDate();
    
	// Retrieve latest from FSA data feed
    request(
    	{uri: rssUrl}, 
    	function(err, response, body) {

	        // Basic error check
	        if(err && response.statusCode !== 200){
	            console.log('Request error.');
	        } else {
	        	console.log('Feed retrieved.');
	        }
	        
	        parser.parseComplete(body);
	        
	        var items = handler.dom.items;
            var itemsToPublish = [];	            
	
	        for(key in items){
	            
	            // Check whether this item (from the RSS feed)
	            // is more recent than the item most recently tweeted
	            var itemDate = new Date(items[key].pubDate);
	            
	            if(itemDate > latestPostedItemDate){
	                // add to a publish array here
	                itemsToPublish.push(items[key]);
	            };
	        
	        };
	
	        console.log(itemsToPublish.length + ' new items found.\n');            
	
	        publishNewAlerts(itemsToPublish);
    	}        
    )
};


function publishNewAlerts(itemsToPublish) {

    // sort items to publish on pubDate
    itemsToPublish.sort(compareDates);

	for(var i in itemsToPublish) {
        
    	var alert = itemsToPublish[i];
    
    	/*
			Decode the escaped alert summary into markup,
			albeit still an XML string.
			
			TODO: Find out where it's being escaped and 
			skip that step.
		*/	  
		var alertDescriptionXml = xmlentities.decode(alert.description);
		
		// Turn the XML string into a DOM object.	
		var alertDescriptionDom = new dom().parseFromString(alertDescriptionXml);
		
	
		/*
			Extract the string value of the summary
			and add it to the properties of this alert.
		*/						
		alert.summaryString = xpath.select('string(/*)', alertDescriptionDom);	
    	
		/*
			Log the date, title and summary of this alert.
		 */
		console.log(alert.pubDate + '\n' + alert.title + "\n\n" + alert.summaryString + "\n\n");
        
		
        // Publish to the generic alerts tweet feed
        publishToTwitter(allAlerts, alert);
		
        
        /*
        	Check to see whether it should also be tweeted to 
        	more specific twitter feeds.
        */        
        console.log('Total feeds to check: '+ twitterApp.getTotalFeeds());		
        
        for (var f = 0; f < twitterApp.getTotalFeeds(); f++) {                        
        	publishFiltered(twitterApp.feeds[f], alert);
        };
                
        console.log('\nCheck complete.\n\n');
        
    };

};


/*
	Make an initial check for updates.
*/
setImmediate(
	function(){
		getNewAlerts();
	}
);


/*
	Re-check every so often.
	Frequency determined by the value of intervalLength.
*/
setInterval(
	function(){
		getNewAlerts();
	}, 
	intervalLength
);


function publishFiltered(twitterAccount, alert) {
            	
	console.log('Checking ' + twitterAccount.name);            	
            	
	/* 
		Check whether the Twitter account associated with this allergen
		is enabled.  If not, there's no point in continuing.
		The same goes for if there are no keywords associated with this 
		account.
	*/ 
	if (!twitterAccount.enabled || twitterAccount.getTotalMatchExpressions() == 0) {	
		return;
	};
	
	
	/*
		Loop through the list of regular expressions for matching
		alerts to this allergen.  If the description for the 
		current alert contains one of these keywords, publish the 
		alert to the Twitter feed specified. Stop as soon as a 
		match is made or once the entire list of keywords has been
		checked.
	*/
	var relevant = false;
	var i = 0;	
	do {  
		
		var expression = new RegExp(twitterAccount.matchExpressions[i++], "gim");		
		relevant = expression.test(alert.summaryString);		
			
	} while (
		relevant != true &&
		i < twitterAccount.getTotalMatchExpressions()
	);
	
	if (relevant == true) {
		publishToTwitter(twitterAccount, alert);
	}
};