AdminSubscriptionReady = Meteor.subscribe("admin").ready;

// get the state document id from the server
Meteor.call('createWorkstationSession', function(error, result) {
   console.log('client/index.js createNewWorkStationSession\n\told workstationSession: ' + workstationSession);
   workstationSession = result;
});