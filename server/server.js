// Create the Twitter API object
var Twit = new TwitMaker({
	consumer_key: 'dqcMeV5hxtfXXn72eKTxwvsRB',
	consumer_secret: 'xNfukQcCZLw6Kx9VAwDhuY8F8fq55U7RWqTCEoRFpwyedyPKK8',
	access_token: '301480573-oxhOLZp3aVFhEKVPD8TFqF0SVow8qPAlhVnUdfyT',
	access_token_secret: 'jPrCoBNHyxtTfIkWnfi4jashz2iq1Zbqsqo2A7lVgKK7E'
});

/**
 * Fetches tweets from Twitter, starting from after the last stored tweet, and
 * stores them in the 'Tweets' collection.
 * @param {number} [count=100] - The (max) number of tweets to fetch.
 */
function fetchTweets(count) {
	var count = count || 100

	var sinceIdStr = '0'
	var tweetFetchCheckpoint = TweetFetchCheckpoints.findOne()

	if (tweetFetchCheckpoint) {
		sinceIdStr = tweetFetchCheckpoint['max_id_str']
	}

	Twit.get(
		'search/tweets', // Twitter API endpoint 		
		{ // Query params
			q: '#worldcup', 
			count: count,
			since_id: sinceIdStr
		},		
		Meteor.bindEnvironment( // Needed to run the callback in a Fiber
			function(err, data) {
				if (!err) {
					storeTweets(data['statuses'])
				}
			}
		)
	);	
}

/**
 * Stores tweets in the 'Tweets' collection.
 * @param {object[]} tweets - An array of tweets (generally the 'statuses')
 * attribute of the reponse data from Twitter.
 */
function storeTweets(tweets) {
	var maxIdStr = null;

	for (i = 0; i < tweets.length; i++) {
		var tweet = tweets[0];

		var conciseTweet = removeUnwantedTweetFields(tweet);
		
		Tweets.insert(conciseTweet);

		var tweetIdStr = conciseTweet['id_str'];

		if (tweetIdStr > maxIdStr) {
			maxIdStr = tweetIdStr;
		}
	}

	if (maxIdStr) {
		updateTweetFetchCheckpoint(maxIdStr)	
	}
}

/**
 * Records the id of the last stored tweet, which can then be used as the
 * 'since_id' for the next fetch.
 * @param {string} maxIdStr - The largest tweet id seen yet.
 */
function updateTweetFetchCheckpoint(maxIdStr) {
	// Does a create of update, as required
	TweetFetchCheckpoints.update(
		{ max_id_str: { $exists: true } },
		{ max_id_str: maxIdStr },
		{ upsert: true });
}

/**
 * Removes unwanted fields from a tweet returned by Twitter, since we don't
 * need to store everything in the database.
 * @param {object} tweet - A Tweet as returned by the Twitter API.
 * @returns {object} The pared down tweet, suitable for storage in the DB.
 */
function removeUnwantedTweetFields(tweet) {
	var tweetUser = tweet['user'];

	// We have tried to preserve the order of the fields as returned from
	// Twitter
	var conciseTweet = {
		created_at: tweet['created_at'],
		id_str: tweet['id_str'],
		text: tweet['text'],
		in_reply_to_status_id_str: tweet['in_reply_to_status_id_str'],
		in_reply_to_user_id_str: tweet['in_reply_to_user_id_str'],
		in_reply_to_screen_name: tweet['in_reply_to_screen_name'],
		user: {
			id_str: tweetUser['id_str'],
			screen_name: tweetUser['screen_name'],
			location: tweetUser['location'],			
		},
		retweet_count: tweet['retweet_count'],
		favorite_count: tweet['favorite_count']
	};

	return conciseTweet;
}

// A cron job for repeatedly fetching tweets
SyncedCron.add({
  name: 'fetchTweets',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('every 15 seconds');
  }, 
  job: function() {
  	fetchTweets(1)
  }
});

// Start all cron jobs
Meteor.startup(function() {
  SyncedCron.start();
});