var request = require('request'),
url = require('url'),
htmlparser = require('htmlparser'),
fs = require('fs'),
Twit = require('twit');

// Config variables
var rssUrl = 'http://www.food.gov.uk/news-updates/allergynews-rss';
var intervalLength = 2000;

var twitter = new Twit({
    	consumer_key:         process.env['TWITTER_ALLERGEN_ALERTS_CONSUMER_KEY']
  	  , consumer_secret:      process.env['TWITTER_ALLERGEN_ALERTS_CONSUMER_SECRET']
      , access_token:         process.env['TWITTER_ALLERGEN_ALERTS_ACCESS_TOKEN']
      , access_token_secret:  process.env['TWITTER_ALLERGEN_ALERTS_ACCESS_SECRET']
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
function publishToTwitter(item){
    var tweet = item.title + ' ' + item.link;
    console.log('publishing to twitter'+item.description);
    console.log('tweet: '+tweet);
    twitter.post('statuses/update', { status: tweet }, function(err, data, response) {
		     if (err)
			 console.log(err);
		     console.log(data);
		 });

}

// looping on the server (every second)
setInterval(function(){

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
            // if (itemsToPublish[i].description.indexOf('gluten')>-1 || itemsToPublish[i].description.indexOf('Gluten')>-1) {
                publishToTwitter(itemsToPublish[i]);
            // }
            setLatestPostedItemDate(itemsToPublish[i].pubDate);
        }
        
    });
    console.log('\n');
}, intervalLength);
