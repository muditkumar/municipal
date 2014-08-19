// This file is loaded after all other server js files, since it is named 
// 'main'.

// Start all cron jobs
Meteor.startup(function() {
  SyncedCron.start();
});
