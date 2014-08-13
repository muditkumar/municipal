var Twit = new TwitMaker({
	consumer_key: 'dqcMeV5hxtfXXn72eKTxwvsRB',
    consumer_secret: 'xNfukQcCZLw6Kx9VAwDhuY8F8fq55U7RWqTCEoRFpwyedyPKK8',
  	access_token: '301480573-oxhOLZp3aVFhEKVPD8TFqF0SVow8qPAlhVnUdfyT',
  	access_token_secret: 'jPrCoBNHyxtTfIkWnfi4jashz2iq1Zbqsqo2A7lVgKK7E'
});

/**
 * Fetches tweets from Twitter, starting from after the last stored tweet.
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
			q: '@meteorjs', 
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
		var tweetIdStr = tweets[0]['id_str'];

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
 * the 'since_id' for the next fetch.
 * @param {string} maxIdStr - The largest tweet id seen yet.
 */
function updateTweetFetchCheckpoint(maxIdStr) {
	// Does a create of update, as required
	TweetFetchCheckpoints.update(
		{ max_id_str: { $exists: true } },
		{ max_id_str: maxIdStr },
		{ upsert: true });
}

// Testing the tweet fetching -> storing mechanism
fetchTweets(1)