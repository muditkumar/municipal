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
