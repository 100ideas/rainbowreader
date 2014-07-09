//// TODO replace global functions with require-like functionality
////
//// hitlist:
//// takePhoto
//// runOpenCFU
//// postColonyData

// Holds the id of the mongo document which holds the state between server and client.
// Is a string once the server creates the document, but Templates will not react at
// all if it is '' or undefined
workstationSession = {};

if (Meteor.isClient) {
  // get the state document id from the server
  Meteor.call('createWorkstationSession', function(error, result) {
     workstationSession = result;
  });

  // Helper for retrieving state.  There should only be one.
  function getSessionDocument() {
    return WorkstationSessions.findOne(workstationSession);
  }
  
  ///////////////////////////////////////////////////////////////////////////////
  // STATE MACHINE / WORKFLOW template functions
  // These are evaluated by the html to see what we should be showing when.
  // Probably only one should evaluate to true at a time.

  // starting state, so return true by default
  Template.hello.showScanBarcodes = function () {
    var doc = getSessionDocument();
    if (!doc) return true;
    return !doc.dishBarcode || !doc.userBarcode;
  }

  // once we have scanned both barcodes, show instructions for taking photograph
  Template.hello.showTakePhoto = function () {
    var doc = getSessionDocument();
    if (!doc) return false;
    return doc.userBarcode && doc.dishBarcode && !doc.photoURL;
  }

  // show the image and colony animations
  Template.hello.showDishPhoto = function () {
    var doc = getSessionDocument();
    if (!doc) return false;
    return doc.photoURL;
  };

  ///////////////////////////////////////////////////////////////////////////////
  // EVENT HANDLERS

  Template.hello.events({
    // TODO how is this function hooked up to the Take Photo button?
    // take a photograph and analyze it on the server;
    // we will receive colonyData through {{colonyData}} handlebars
    'click input': function () {
      Meteor.call('takeAndAnalyzePhoto', getSessionDocument().dishBarcode,
        function(error, result) {});
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.methods({
    createWorkstationSession: function() {
      // create a single mongo document to hold state between server and client
      console.log('create session');
      WorkstationSessions.remove({});   //clear previous session documents
      workstationSession = WorkstationSessions.insert({dateCreated: Date.now()});
      return workstationSession;
    },
    
    takeAndAnalyzePhoto: function(dishBarcode) {
      takePhoto(dishBarcode, Meteor.bindEnvironment(function(photoPath) {

        // convert '~/rainbowreader/public/photos/photo1.jpg'
        // to 'photos/photo1.jpg'
        var ixPhotos = photoPath.indexOf('photos/');
        if (ixPhotos === -1) {
          console.log('error parsing photo path into URL: ' + photoPath);
          return;
        }
        var photoURL = photoPath.slice(ixPhotos);

        WorkstationSessions.update(
          {dishBarcode: dishBarcode},
          {$set: {photoURL: photoURL}}
        );

        runOpenCFU(photoPath, Meteor.bindEnvironment(function(colonyData) {
          WorkstationSessions.update(
            {dishBarcode: dishBarcode},
            {$set: {colonyData: colonyData}}
          );

          // uploads relevant data to the main visualization server
          //postColonyData(dishBarcode, colonyData, photoPath);
        }));
      }));
    }
  });
}
