// document which stores the state of the current session
WorkstationSessions = new Meteor.Collection('workstationSessions');

// shared db of all data on plates on the visualization server
Experiments = new Meteor.Collection('experiments');

// Holds the id of the mongo document which holds the state between server and client.
// Is a string once the server creates the document, but Templates will not react at
// all if it is '' or undefined
workstationSession = {};

Visualizations = new Meteor.Collection('visualizations');

Admin = new Meteor.Collection('admin');
