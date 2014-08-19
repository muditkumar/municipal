/** 
 * Creates posts out of tweets from the 'Tweets' collection.
 */
PostCreator = function() {  
};

/**
 * Creates a post from a tweet, and stores it in the 'Posts' collection.
 * @param (Object) tweet - A tweet from the 'Tweets' collection.
 */
PostCreator.prototype.createPost = function(tweet) {
    console.log('Creating a post from...');
    console.log(tweet);
}
