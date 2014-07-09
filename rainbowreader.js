//// TODO replace global functions with require-like functionality
////
//// hitlist:
//// takeAndAnalyzePhoto
//// postColonyData

workstationSession = {};

if (Meteor.isClient) {

  Meteor.call('createWorkstationSession', function(error, result) {
     workstationSession = result;
  });

  function getSessionDocument() {
    return WorkstationSessions.findOne(workstationSession);
  }
   
  Template.hello.showScanBarcodes = function () {
    var doc = getSessionDocument();
    if (!doc) return true;
    return !doc.dishBarcode || !doc.userBarcode;
  }

  Template.hello.showTakePhoto = function () {
    var doc = getSessionDocument();
    if (!doc) return false;
    return doc.userBarcode && doc.dishBarcode && !doc.photoURL;
  }

  Template.hello.showDishImage = function () {
    var doc = getSessionDocument();
    if (!doc) return false;
    return doc.photoURL;
  };

  Template.hello.events({
    'click input': function () {
      Meteor.call('takeAndAnalyzePhoto', getSessionDocument().dishBarcode, function(error, result) {
        console.log('taap result:' + result);
      });
    }
  });
}

/*  sessionCursor.observe({
    changed: function(doc, oldDoc) {
      // state machine based on session document fields
      
      // User has scanned both their ticket and the petri dish.
      // Show the instructions for taking a picture of the dish.
      if (doc.userBarcode && doc.dishBarcode && !doc.dishPhotoReady) {
        console.log(doc.userBarcode);
      }
      // show waiting screen while dish is photographed
      else if (doc.dishPhotoReady && !doc.pictureURL) {

      }
      // show petri dish photo
      else if (doc.pictureURL && !doc.colonyData) {

      }
      // colonyData has arrived; show reticle animation
      else { 

      }
    }
  });*/


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.methods({
    createWorkstationSession: function() {
      console.log('create ws');
      workstationSession = WorkstationSessions.insert({dateCreated: Date.now()});
      return workstationSession;
    },
    
    takeAndAnalyzePhoto: function(dishBarcode) {
      takePhoto(dishBarcode, Meteor.bindEnvironment(function(photoPath) {

        //// TODO change this to a path relative 
        //// to /public/ for use by the client
        var photoURL = 'small.jpg';//photoPath;

        WorkstationSessions.update(
          {dishBarcode: dishBarcode},
          {$set: {photoURL: photoURL}}
        );

        var colonyData = runOpenCFU(photoPath, Meteor.bindEnvironment(function(colonyData) {
          console.log('runOpenCFU callback');
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

/*
  var sessionCursor = WorkstationSessions.find(null, {});
  sessionCursor.observe({
    changed: function(doc, oldDoc) {
      // state machine based on session document fields
      if (doc.dishPhotoReady) {
        // take a picture
        var photoFilename = takePicture(doc.dishBarcode);

        // run openCFU
        var colonyData = runOpenCFU(photoFilename);

        // convert '~/rainbowreader/public/photos/photo1.jpg'
        // to 'http://localhost:3000/photos/photo1.jpg'
        var ixPhotos = photoFilename.indexOf('/photos');
        if (ixPhotos === -1) {
          console.log('error parsing photo path into URL: ' + photoFilename);
          return;
        }
        doc.pictureURL = 'http://localhost:3000' + photoFilename.slice(ixPhotos);
      }
    }
  });*/
