# IDE Setup

If using WebStorm, the following customizations are:

## Required
1. .gitignore: Exclude .idea
1. Settings > Directories: Exclude .idea and .meteor
1. Settings > Editor > Editor Tabs: Enable "Mark modified tabs with asterisk"
1. Settings > General: Disable "Save files on frame deactivation" and 
    "Save files automatically", to get Meteor auto-restarts to work correctly
    
## Helpful
1. Settings > Javascript > Libraries: Add ~/.meteor/packages, to enable Meteor
    code completion
1. View > Tool Windows > Mongo Explorer: Set up a server with as follows:
    Label: meteor-mongo, Server URL(s): 127.0.0.1:3000, Database: meteor. 
    This will allow you to view the collection in the DB straight from WebStorm

For more ideas on customization, see
https://github.com/awatson1978/meteor-cookbook/blob/master/cookbook/webstorm.md

If using SublimeText or TextMate, no such customizations are required.
For other IDEs or editors not mentioned here, do a Google search for how to use
with Meteor.
