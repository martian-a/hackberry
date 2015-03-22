var request = require('request'),
url = require('url'),
htmlparser = require('htmlparser'),
fs = require('fs'),
Twit = require('twit');

// Config variables
var rssUrl = 'http://www.food.gov.uk/news-updates/allergynews-rss';

/*
	Specify how frequently the FSA RSS feed should be checked
	(milliseconds)
*/
var oneMinute = (1000 * 60);
var intervalLength = (5 * oneMinute);

var twitterAllergenAlerts = new Twit({
    	consumer_key:         process.env['TWITTER_ALLERGEN_ALERTS_CONSUMER_KEY']
  	  , consumer_secret:      process.env['TWITTER_ALLERGEN_ALERTS_CONSUMER_SECRET']
      , access_token:         process.env['TWITTER_ALLERGEN_ALERTS_ACCESS_TOKEN']
      , access_token_secret:  process.env['TWITTER_ALLERGEN_ALERTS_ACCESS_SECRET']
});

var twitterEggAlertsEnabled = false;
var twitterEggAlerts = new Twit({
    	consumer_key:         process.env['TWITTER_ALLERGEN_ALERTS_CONSUMER_KEY']
  	  , consumer_secret:      process.env['TWITTER_ALLERGEN_ALERTS_CONSUMER_SECRET']
      , access_token:         process.env['TWITTER_EGG_ALERTS_ACCESS_TOKEN']
      , access_token_secret:  process.env['TWITTER_EGG_ALERTS_ACCESS_SECRET']
});

var twitterMilkAlertsEnabled = false;
var twitterMilkAlerts = new Twit({
    	consumer_key:         process.env['TWITTER_ALLERGEN_ALERTS_CONSUMER_KEY']
  	  , consumer_secret:      process.env['TWITTER_ALLERGEN_ALERTS_CONSUMER_SECRET']
      , access_token:         process.env['TWITTER_MILK_ALERTS_ACCESS_TOKEN']
      , access_token_secret:  process.env['TWITTER_MILK_ALERTS_ACCESS_SECRET']
});

var twitterFishAlertsEnabled = false;
var twitterFishAlerts = new Twit({
    	consumer_key:         process.env['TWITTER_ALLERGEN_ALERTS_CONSUMER_KEY']
  	  , consumer_secret:      process.env['TWITTER_ALLERGEN_ALERTS_CONSUMER_SECRET']
      , access_token:         process.env['TWITTER_FISH_ALERTS_ACCESS_TOKEN']
      , access_token_secret:  process.env['TWITTER_FISH_ALERTS_ACCESS_SECRET']
});

var twitterCrustaceanAlertsEnabled = false;
var twitterCrustaceanAlerts;
if (twitterCrustaceanAlertsEnabled == true) {
	twitterCrustaceanAlerts = new Twit({
    	consumer_key:         process.env['TWITTER_ALLERGEN_ALERTS_CONSUMER_KEY']
  	  , consumer_secret:      process.env['TWITTER_ALLERGEN_ALERTS_CONSUMER_SECRET']
      , access_token:         process.env['TWITTER_CRUSTACEAN_ALERTS_ACCESS_TOKEN']
      , access_token_secret:  process.env['TWITTER_CRUSTACEAN_ALERTS_ACCESS_SECRET']
	});
};

var twitterGlutenAlertsEnabled = false;
var twitterGlutenAlerts;
if (twitterGlutenAlertsEnabled == true) {
	twitterGlutenAlerts = new Twit({
    	consumer_key:         process.env['TWITTER_ALLERGEN_ALERTS_CONSUMER_KEY']
  	  , consumer_secret:      process.env['TWITTER_ALLERGEN_ALERTS_CONSUMER_SECRET']
      , access_token:         process.env['TWITTER_GLUTEN_ALERTS_ACCESS_TOKEN']
      , access_token_secret:  process.env['TWITTER_GLUTEN_ALERTS_ACCESS_SECRET']
	});
};

var twitterNutAlertsEnabled = false;
var twitterNutAlerts;
if (twitterNutAlertsEnabled == true) {
	twitterNutAlerts = new Twit({
    	consumer_key:         process.env['TWITTER_ALLERGEN_ALERTS_CONSUMER_KEY']
  	  , consumer_secret:      process.env['TWITTER_ALLERGEN_ALERTS_CONSUMER_SECRET']
      , access_token:         process.env['TWITTER_NUT_ALERTS_ACCESS_TOKEN']
      , access_token_secret:  process.env['TWITTER_NUT_ALERTS_ACCESS_SECRET']
});
};

var twitterPeanutAlertsEnabled = false;
var twitterPeanutAlerts;
if (twitterPeanutAlertsEnabled == true) {
	twitterPeanutAlerts = new Twit({
    	consumer_key:         process.env['TWITTER_ALLERGEN_ALERTS_CONSUMER_KEY']
  	  , consumer_secret:      process.env['TWITTER_ALLERGEN_ALERTS_CONSUMER_SECRET']
      , access_token:         process.env['TWITTER_PEANUT_ALERTS_ACCESS_TOKEN']
      , access_token_secret:  process.env['TWITTER_PEANUT_ALERTS_ACCESS_SECRET']
});
};

var twitterCeleryAlertsEnabled = false;
var twitterCeleryAlerts;
if (twitterCeleryAlertsEnabled == true) {
	twitterCeleryAlerts = new Twit({
    	consumer_key:         process.env['TWITTER_ALLERGEN_ALERTS_CONSUMER_KEY']
  	  , consumer_secret:      process.env['TWITTER_ALLERGEN_ALERTS_CONSUMER_SECRET']
      , access_token:         process.env['TWITTER_CELERY_ALERTS_ACCESS_TOKEN']
      , access_token_secret:  process.env['TWITTER_CELERY_ALERTS_ACCESS_SECRET']
});
};

var twitterSulphiteAlertsEnabled = true;
var twitterSulphiteAlerts = new Twit({
    	consumer_key:         process.env['TWITTER_ALLERGEN_ALERTS_CONSUMER_KEY']
  	  , consumer_secret:      process.env['TWITTER_ALLERGEN_ALERTS_CONSUMER_SECRET']
      , access_token:         process.env['TWITTER_SULPHITE_ALERTS_ACCESS_TOKEN']
      , access_token_secret:  process.env['TWITTER_SULPHITE_ALERTS_ACCESS_SECRET']
});

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
function publishToTwitter(twitterAccount, item){
    var tweet = item.title + ' ' + item.link;
    console.log('publishing to twitter'+item.description);
    console.log('tweet: '+tweet);
    twitterAccount.post('statuses/update', { status: tweet }, function(err, data, response) {
		     if (err)
			 console.log(err);
		     console.log(data);
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
        
            //console.log(prop + ': ' + items[prop].title + ' ' + items[prop].link + '\n');
            
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
            console.log(itemsToPublish[i].pubDate + ' ' + itemsToPublish[i].title);
            
            // Publish to the generic alerts tweet feed
            publishToTwitter(twitterAllergenAlerts, itemsToPublish[i]);
            
            /*
            	Update the local record of the most recently
            	tweeted alert.
            */
            setLatestPostedItemDate(itemsToPublish[i].pubDate);
            
            /*
            	Check to see whether it should also be tweeted to 
            	more specific twitter feeds.
            */
            
            
            // Egg
            if (
            	twitterEggAlertsEnabled == true && (
            		itemsToPublish[i].description.indexOf('egg')>-1 || 
            		itemsToPublish[i].description.indexOf('Egg')>-1
            	)
            ) {
                publishToTwitter(twitterEggAlerts, itemsToPublish[i]);
            };
            
            
            // Milk 
            if (
            	twitterMilkAlertsEnabled == true && (
            		itemsToPublish[i].description.indexOf('milk')>-1 || 
            		itemsToPublish[i].description.indexOf('Milk')>-1
            	)
            ) {            
                publishToTwitter(twitterMilkAlerts, itemsToPublish[i]);
            };
                       
            
            // Fish 
            if (
            	twitterFishAlertsEnabled == true && (
            		itemsToPublish[i].description.indexOf('fish')>-1 || 
            		itemsToPublish[i].description.indexOf('Fish')>-1
            	)
            ) { 
                publishToTwitter(twitterFishAlerts, itemsToPublish[i]);
            };
            
            
            /* Crustaceans
               Including crab, lobster, crayfish, shrimp, prawn.
            */
			if (
            	twitterCrustaceanAlertsEnabled == true && (
            		itemsToPublish[i].description.indexOf('crustacean')>-1 ||
	            	itemsToPublish[i].description.indexOf('Crustacean')>-1 || 
	            	itemsToPublish[i].description.indexOf('crab')>-1 ||
	            	itemsToPublish[i].description.indexOf('Crab')>-1 ||
	            	itemsToPublish[i].description.indexOf('crayfish')>-1 ||
	            	itemsToPublish[i].description.indexOf('Crayfish')>-1 ||
	            	itemsToPublish[i].description.indexOf('shrimp')>-1 ||
	            	itemsToPublish[i].description.indexOf('Shrimp')>-1 ||
	            	itemsToPublish[i].description.indexOf('prawn')>-1 ||
	            	itemsToPublish[i].description.indexOf('Prawn')>-1
            	)
            ) {                
				publishToTwitter(twitterCrustaceanAlerts, itemsToPublish[i]);
            };
            
            
            // Gluten
			if (
            	twitterGlutenAlertsEnabled == true && (
            		itemsToPublish[i].description.indexOf('gluten')>-1 || 
            		itemsToPublish[i].description.indexOf('Gluten')>-1
            	)
            ) { 
                publishToTwitter(twitterGlutenAlerts, itemsToPublish[i]);
            };
            
            // Nuts
			if (
            	twitterNutAlertsEnabled == true && (
            		itemsToPublish[i].description.indexOf('nut')>-1 || 
            		itemsToPublish[i].description.indexOf('Nut')>-1 ||
            		itemsToPublish[i].description.indexOf('peanut')>-1 || 
            		itemsToPublish[i].description.indexOf('Peanut')>-1
            	) 
            ) {                
                publishToTwitter(twitterNutAlerts, itemsToPublish[i]);                
            };
            
            // Peanuts 
			if (
        		twitterPeanutAlertsEnabled == true && (
            		itemsToPublish[i].description.indexOf('peanut')>-1 || 
            		itemsToPublish[i].description.indexOf('Peanut')>-1
            	)
            ) {
                publishToTwitter(twitterPeanutAlerts, itemsToPublish[i]);
            };
            
            // Celery 
			if (
            	twitterCeleryAlertsEnabled == true && (
            		itemsToPublish[i].description.indexOf('celery')>-1 || 
            		itemsToPublish[i].description.indexOf('Celery')>-1
            	)
            ) { 
                publishToTwitter(twitterCeleryAlerts, itemsToPublish[i]);
            };
            
            // Sulphites 
			if (
            	twitterSulphiteAlertsEnabled == true && (
            		itemsToPublish[i].description.indexOf('sulphite')>-1 || 
            		itemsToPublish[i].description.indexOf('Sulphite')>-1 ||
            		itemsToPublish[i].description.indexOf('sulphur')>-1 || 
            		itemsToPublish[i].description.indexOf('Sulpher')>-1 
            	)
            ) { 
                publishToTwitter(twitterSulphiteAlerts, itemsToPublish[i]);
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
