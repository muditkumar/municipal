# IDE Setup

If using WebStorm, the following customization is:

## Required
1. .gitignore: Exclude .idea
1. Settings > Directories: Exclude .idea and .meteor
1. Settings > Editor > Editor Tabs: Enable "Mark modified tabs with asterisk"
1. Settings > General: Disable "Save files on frame deactivation" and 
    "Save files automatically", to get Meteor auto-restarts to work correctly
    
## Helpful
1. Settings > Javascript > Libraries: Add ~/.meteor/packages, to enable Meteor
    code completion
1. View > Tool Windows > Mongo Explorer: Set up a server as follows:
    Label: meteor-mongo, Server URL(s): 127.0.0.1:3000, Database: meteor. 
    This will allow you to view collections in the DB directly from WebStorm.

For more customization ideas, see
https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/webstorm.md

If using SublimeText, TextMate, or any other non-IDE editor, no customization
should be necessary.

# Meteor Setup

Standard Meteor packages themselves will usually not be enough for creating a 
complete app. So we must install Meteorite, for pulling-in community created 
Meteor packages from Atmosphere (https://atmospherejs.com/). 

See http://oortcloud.github.io/meteorite/ for instructions. 

It is theoretically possible to use ANY node.js module in a Meteor app, but we
discourage it at this point. We feel it may lead to problems when deploying to
any PaaS offering such as Modulus etc.

See https://meteorhacks.com/npm-meteor-integration-is-back.html for how to use
npm modules with Meteor.

# App Architecture

App execution begins in the server/main.js file.

## Main Background Jobs

There are two main background jobs which form the "meat" of the application.
These can be found in the server/jobs directory.

### The fetch_and_store_tweets job

This job periodically fetches and stores tweets from Twitter via the REST API.
Job frequency and batch size can be configured via constants at the top of the
file.

NOTE: This is only a 'shortcut' provided for easy development. The right way
to store tweets is using the separate 'municipal-tweet-fetcher' app, as it uses 
the more robust Twitter streaming API. However, for quick development, use this 
job instead, but be aware that due to the nature of the REST API, some tweets
may be missed.

If you wish to use municipal-tweet-fetcher instead of the REST API, you must 
start this app connected to an 'external' DB (i.e. not the Meteor auto-created 
one). To do so, use the following command start command:

MONGO_URL=mongodb://localhost:27017/<db-name> meteor

Note the port. You may have to change it to suit your Mongo configuration.
Remember to also start your Mongo instance via the 'mongod' command if needed.

Similarly, you must also start municipal-tweet-fetcher connected to this same 
'external' DB.

NOTE: municipal-tweet-fetcher is under development, and will be ready soon.

### The process_tweets_into_posts job

This job fetches stored tweets and creates posts (i.e. complaints) from them.
Job frequency and batch size can be configured via constants at the top of the
file.

## Main Business Logic

There are a few classes that do a lot of the heavy lifting for processing the
tweet data.

1. PostCreator (server/post_creator.js)
1. FuzzyLocationFinder (server/fuzzy_location_finder.js)
