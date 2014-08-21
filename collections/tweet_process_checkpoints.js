/**
 * Stores the Twitter id of the last tweet from the 'Tweets' collection that 
 * has been processed into a post.
 * @type {Meteor.Collection}
 */
TweetProcessCheckpoints = new Meteor.Collection('tweet_process_checkpoints');
