// Sets up a cron job for processing stored tweets into posts.
// Contains all the logic for every step of this process.
// Only implementing the logic within PostCreator.createPost() is required,
// which must also store the post once created.

var log = new Logger('process_tweets_into_posts_job');

// Job control parameters.
// Change to suit your needs.
var TWEET_PROCESS_BATCH_SIZE = 10;
var TWEET_PROCESS_JOB_SCHEDULE = 'every 20 secs starting on the 11th sec';

/**
 * Fetches tweets from the 'Tweets' collection, resuming after the last
 * processed tweet, processes them into posts (i.e. complaints) and stores
 * them in the 'Posts' collection.
 * @param {number} [count=100] - The (max) number of tweets to fetch.
 */
function processTweetsIntoPosts(count) {
  count = count || 10;

  var selector = {};
  var tweetProcessCheckpoint = TweetProcessCheckpoints.findOne();

  if (tweetProcessCheckpoint) {
    var maxIdStr = tweetProcessCheckpoint['max_id_str'];

    if (maxIdStr) {
      selector = {
        'id_str': { $gt: maxIdStr }
      };

      log.info('Processing tweets since tweet id ' + maxIdStr);
    }
  }

  var tweets = Tweets.find(selector, {
      sort: { 'id_str': 1 },
      limit: count
  });

  createPosts(tweets);
}

/**
 * Creates posts out of tweets given as a 'Tweets' collection cursor, and
 * stores them in the 'Posts' collection.
 * @param {object} tweets - The tweets, as a cursor
 */
function createPosts(tweets) {
  var maxIdStr = null;

  tweets.forEach(function (tweet) {
    var tweetIdStr = tweet['id_str'];

    new PostCreator().createPostFromTweet(tweet);

    if (tweetIdStr > maxIdStr) {
      maxIdStr = tweetIdStr;
    }
  });

  if (maxIdStr) {
    updateTweetProcessCheckpoint(maxIdStr);
  }
}

/**
 * Records the Twitter id of the last processed tweet.
 * This can then be used as a 'cursor' for the next fetch.
 * @param {string} maxIdStr - The largest tweet id processed yet (not the
 * mongodb object _id, but the Twitter id).
 */
function updateTweetProcessCheckpoint(maxIdStr) {
  // Does a create or update, as required
  TweetProcessCheckpoints.update(
    {
      max_id_str: { $exists: true }
    },
    { max_id_str: maxIdStr },
    { upsert: true }
  );
}

// A cron job for fetching tweets from Twitter, and storing them in the 
// 'Tweets' collection.
SyncedCron.add({
  name: 'processTweetsIntoPosts',
  schedule: function (parser) {
    // parser is a later.parse object
    return parser.text(TWEET_PROCESS_JOB_SCHEDULE);
  },
  job: function () {
    processTweetsIntoPosts(TWEET_PROCESS_BATCH_SIZE);
  }
});
