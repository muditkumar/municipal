var log = new Logger('PostCreator');

/**
 * Creates posts out of tweets from the 'Tweets' collection.
 * @constructor
 */
PostCreator = function () {
};

/**
 * Creates a post from a tweet, and stores it in the 'Posts' collection.
 * @param {object} tweet - A tweet from the 'Tweets' collection.
 */
PostCreator.prototype.createPostFromTweet = function (tweet) {
  var post = buildPostFromTweet(tweet);

  if (post) {
    Posts.insert(post);
  }
};

/////////////
// Private //
/////////////

var HASHTAG_REGEX = /(^#|\s#)([a-z0-9_]+)/gi;

/**
 * Builds a post from a tweet from the 'Tweets' collection, and returns it.
 * Does not store the post anywhere.
 * @param {object} tweet - A tweet from the 'Tweets' collection.
 * @returns {object} A post, or null if a post could not be created due to
 * some reason.
 */
function buildPostFromTweet(tweet) {
  var tweetUser = tweet['user'];

  var hashtags = getHashtags(tweet['text']);

  if (!hashtags) {
    return null;
  }

  var locationStr = hashtags[0];
  var location = new FuzzyLocationFinder().findLocation(locationStr);

  if (location) {
    return {
      created_at: tweet['created_at'],
      text: tweet['text'],
      location: location,
      twitter_user: {
        id_str: tweetUser['id_str'],
        screen_name: tweetUser['screen_name'],
        location: tweetUser['location']
      },
      tweet_id_str: tweet['id_str']
    };
  } else {
    log.warn("Could not create post. No match found for location hashtag '"
      + locationStr + "'");
  }
}

/**
 * Returns all hashtags (without the #) in a tweet.
 * @param {string} tweetText - The tweet text.
 * @returns {string[]} An array of hashtags, or null if no hashtags found.
 */
function getHashtags(tweetText) {
  var hashtags = tweetText.match(HASHTAG_REGEX);

  if (!hashtags) {
    return null;
  }

  var cleanedUpHashtags = new Array(hashtags.length);

  for (var i = 0; i < hashtags.length; i++) {
    var hashtag = hashtags[i];

    hashtag = hashtag.trim();
    hashtag = hashtag.slice(1);

    cleanedUpHashtags[i] = hashtag;
  }

  return cleanedUpHashtags;
}
