AdminSubscription = Meteor.subscribe('admin');
WorkstationSessionsSubscription = Meteor.subscribe('workstationSessions');
ExperimentsSubscription = Meteor.subscribe('experiments');
VisualizationsSubscription = Meteor.subscribe('visualizations');

Meteor.startup(function(){
})



// get the state document id from the server
Meteor.call('createWorkstationSession', function(error, result) {
   console.log('client/index.js createNewWorkStationSession\n\told workstationSession: ' + workstationSession);
   workstationSession = result;
});