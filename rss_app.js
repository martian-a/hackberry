var request = require('request'),
url = require('url'),
htmlparser = require('htmlparser'),
fs = require('fs'),
TwitterPublishingApp = require('./lib/twitterPublishingApp'),
Feed = require('./lib/feed'),
xpath = require('xpath'),
dom = require('xmldom').DOMParser,
xmlentities = require("xml-entities")
http = require('http');


/*
	Bind the app to a port on heroku.
*/	
var serverPort = process.env['PORT'];
http.createServer(function (req, res) {

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
}).listen(serverPort);


// Config variables
var rssUrl = 'http://www.food.gov.uk/news-updates/allergynews-rss';

/*
	Specify how frequently the FSA RSS feed should be checked
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
var allAlerts = new Feed();
allAlerts.initTwitter(
	twitterApp, 
	process.env['TWITTER_ALLERGEN_ALERTS_ACCESS_TOKEN'], 
	process.env['TWITTER_ALLERGEN_ALERTS_ACCESS_SECRET']
);


/*
	Twitter Account: UK Celery Alerts
	TODO: https://twitter.com/ukceleryalerts
*/
var celeryAlerts = new Feed(new Array("celery", "celeriac"));
twitterApp.addFeed(celeryAlerts);
/*
celeryAlerts.initTwitter(
	twitterApp,
	process.env['TWITTER_CELERY_ALERTS_ACCESS_TOKEN'], 
	process.env['TWITTER_CELERY_ALERTS_ACCESS_SECRET']
);
*/


/*
	Twitter Account: UK Crustacean Alerts
	TODO: https://twitter.com/ukcrustaceanalerts
*/
var crustaceanAlerts = new Feed(new Array("crustacean", "shellfish", "crab", "crayfish", "prawn", "shrimp", "scampi"));
twitterApp.addFeed(crustaceanAlerts);
/*
crustaceanAlerts.initTwitter(
	twitterApp,
	process.env['TWITTER_CRUSTACEAN_ALERTS_ACCESS_TOKEN'], 
	process.env['TWITTER_CRUSTACEAN_ALERTS_ACCESS_SECRET']
);
*/


/*
	Twitter Account: UK Egg Alerts
	https://twitter.com/UkEggAlerts
*/
var eggAlerts = new Feed(new Array("egg"));
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
var fishAlerts = new Feed(new Array("fish"));
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
var glutenAlerts = new Feed(new Array("gluten"));
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
var lupinAlerts = new Feed(new Array("lupin"));
twitterApp.addFeed(lupinAlerts);
/*
lupinAlerts.initTwitter(
	twitterApp,
	process.env['TWITTER_LUPIN_ALERTS_ACCESS_TOKEN'], 
	process.env['TWITTER_LUPIN_ALERTS_ACCESS_SECRET']
);
*/


/*
	Twitter Account: UK Milk Alerts
	https://twitter.com/UkMilkAlerts
*/
var milkAlerts = new Feed(new Array("milk"));
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
var molluscAlerts = new Feed(new Array("mollusc", "snail", "squid", "whelk"));
twitterApp.addFeed(molluscAlerts);
/*
molluscAlerts.initTwitter(
	twitterApp,
	process.env['TWITTER_MOLLUSC_ALERTS_ACCESS_TOKEN'], 
	process.env['TWITTER_MOLLUSC_ALERTS_ACCESS_SECRET']
);
*/


/*
	Twitter Account: UK Mustard Alerts
	TODO: https://twitter.com/ukmustardalerts
*/
var mustardAlerts = new Feed(new Array("mustard"));
twitterApp.addFeed(mustardAlerts);
/*
mustardAlerts.initTwitter(
	twitterApp,
	process.env['TWITTER_MUSTARD_ALERTS_ACCESS_TOKEN'], 
	process.env['TWITTER_MUSTARD_ALERTS_ACCESS_SECRET']
);
*/


/*
	Twitter Account: UK Nut Alerts
	https://twitter.com/UkNutAlerts
*/
var nutAlerts = new Feed(new Array("nut", "cashew", "almond"));
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
var peanutAlerts = new Feed(new Array("peanut"));
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
var sesameAlerts = new Feed(new Array("sesame"));
twitterApp.addFeed(sesameAlerts);
/*
sesameAlerts.initTwitter(
	twitterApp,
	process.env['TWITTER_SESAME_SEED_ALERTS_ACCESS_TOKEN'], 
	process.env['TWITTER_SESAME_SEED_ALERTS_ACCESS_SECRET']
);
*/


/*
	Twitter Account: UK Soya Alerts
	https://twitter.com/UkSoyaAlerts
*/
var soyaAlerts = new Feed(new Array("soya"));
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
var sulphiteAlerts = new Feed(new Array("sulphite", "sulphur"));
twitterApp.addFeed(sulphiteAlerts);
sulphiteAlerts.initTwitter(
	twitterApp,
	process.env['TWITTER_SULPHITE_ALERTS_ACCESS_TOKEN'], 
	process.env['TWITTER_SULPHITE_ALERTS_ACCESS_SECRET']
);


/*
	Twitter Account: UK Tree Nut Alerts
	TODO: https://twitter.com/treenutalerts
*/
var treeNutAlerts = new Feed(new Array("nut", "cashew", "almond"));
twitterApp.addFeed(treeNutAlerts);
/*
treeNutAlerts.initTwitter(
	twitterApp,
	process.env['TWITTER_TREE_NUT_ALERTS_ACCESS_TOKEN'], 
	process.env['TWITTER_TREE_NUT_ALERTS_ACCESS_SECRET']
);
*/

console.log('Total feeds: ' + twitterApp.getTotalFeeds());

// Get date of latest posted article
var latestPostedItemDate = getLatestPostedItemDate();

console.log('Most recent item posted on: ' + latestPostedItemDate);

// Needed for RSS parsing
var handler = new htmlparser.RssHandler();
var parser = new htmlparser.Parser(handler);

// function to sort of dates
function compareDates(a, b) {

    var aDate = new Date(a.pubDate);
    var bDate = new Date(b.pubDate);

    if (aDate < bDate)
        return -1;
    if (aDate > bDate)
        return 1;
    return 0;
}

// get the date (uses flat file to be replaced with MongoDB)
function getLatestPostedItemDate(){
	
	// Name of the log file containing the date of the most recently posted item
	var latestPostLogFilename = 'latestPostedDate.txt';
	
	try {
	
	  // Create a new instance of Date based on the date of the most recently posted item 
	  // as recorded in the log file
	  return new Date(fs.readFileSync(latestPostLogFilename).toString());
	  
	} catch (e) {
	  
	  // Here you get the error when the file was not found,
	  // but you also get any other error
	  
	  // Create a new instance of Date representing today
	  // as there is no prior date recorded
	  return null;
	  
	} 
}

// set the date (uses flat file to be replaced with MongoDB)
function setLatestPostedItemDate(date){
    latestPostedItemDate = date;
    // write to file
    fs.writeFile('latestPostedDate.txt', latestPostedItemDate);
    return true;
}

// post item to twitter
function publishToTwitter(feed, item){
    
    console.log('Tweeting.');
    
    var title = item.title;
    var linkLength = 23;
    if (item.link.length < linkLength) {
    	linkLength = item.link.length;
    }
    
    if ((linkLength + 1 + title.length) > 140) {
    	title = title.substring(0, (138 - linkLength)) + '…';
    	console.log('Title shortened from:\n     ' + item.title + '\nto:\n     ' + title);
    }
    
    var tweet = title + ' ' + item.link;
    
    feed.twitterAccount.post('statuses/update', { status: tweet }, function(err, data, response) {
		     if (err) {
			 	console.log(err);
			 	console.log(tweet);
			 };
	});

}

/*
	Check the FSA RSS feed and publish new items on Twitter.
*/
function getNewAlerts(){

	// Retrieve latest from FSA data feed
    request({uri: rssUrl}, function(err, response, body){

        // Basic error check
        if(err && response.statusCode !== 200){
            console.log('Request error.');
        } else {
        	console.log('Feed retrieved.');
        }
        
        parser.parseComplete(body);
        
        var items = handler.dom.items;
        
        var itemsToPublish = []; // Array

        for(key in items){
            
            // Check whether this item (from the RSS feed)
            // is more recent than the item most recently tweeted
            var itemDate = new Date(items[key].pubDate);
            
            if(itemDate > latestPostedItemDate){
                // add to a publish array here
                itemsToPublish.push(items[key]);
            };
        
        }
        // sort items to publish on pubDate
        itemsToPublish.sort(compareDates);

        for(var i in itemsToPublish){
        
        	var alert = itemsToPublish[i];
        
            console.log(alert.pubDate + ' ' + alert.title);
            
            // Publish to the generic alerts tweet feed
            publishToTwitter(allAlerts, alert);
            
            /*
            	Update the local record of the most recently
            	tweeted alert.
            */
            setLatestPostedItemDate(alert.pubDate);
    
    
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

			console.log('Alert Summary: ' + alert.summaryString);    
            
            /*
            	Check to see whether it should also be tweeted to 
            	more specific twitter feeds.
            */
            
            console.log('Total feeds to check: '+ twitterApp.getTotalFeeds());
            
            for (var f = 0; f < twitterApp.getTotalFeeds(); f++) {                        
            	publishFiltered(twitterApp.feeds[f], alert);
            };
            
        }
        
    });
    console.log('\n');
}

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
            	
	console.log('Checking ' + twitterAccount.keywords[0]);            	
            	
	/* 
		Check whether the Twitter account associated with this allergen
		is enabled.  If not, there's no point in continuing.
		The same goes for if there are no keywords associated with this 
		account.
	*/ 
	if (!twitterAccount.enabled || twitterAccount.getTotalKeywords() == 0) {	
		return;
	};
	
	
	/*
		Loop through the list of keywords for matching alerts
		to this allergen.  If the description for the current
		alert contains one of these keywords, publish the alert
		to the Twitter feed specified. Stop as soon as a match
		is made or once the entire list of keywords has been
		checked.
	*/
	var relevant = false;
	var i = 0;	
	do {  
		
		if (alert.summaryString.indexOf(twitterAccount.keywords[i++]) >= 0) {
			relevant = true;
			publishToTwitter(twitterAccount, alert);
		}
			
	} while (
		relevant != true &&
		i < twitterAccount.getTotalKeywords()
	);
};