// This file is loaded after all other server js files, since it is named 
// 'main'.

Meteor.startup(function () {
  // Start all cron jobs
  SyncedCron.start();
});
