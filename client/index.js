WorkstationSessionsSubscription = Meteor.subscribe('workstationSessions');
ExperimentsSubscription = Meteor.subscribe('experiments');
VisualizationsSubscription = Meteor.subscribe('visualizations');

workstationSession = "";

Meteor.startup(function(){
  // get the state document id from the server
  Meteor.call('createWorkstationSession', function(error, result) {
    workstationSession = result;
    console.log('client/index.js createNewWorkStationSession\n\told workstationSession: ' + workstationSession);
  });
})