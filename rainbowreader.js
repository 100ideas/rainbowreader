if (Meteor.isClient) {
  workstationSession = WorkstationSessions.insert({});

  var sessionCursor = WorkstationSessions.find();
  sessionCursor.observe({
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
  });
 
  Template.hello.greeting = function () {
    return "Welcome to rainbowreader.  Session id: " + workstationSession;
  };

  Template.hello.events({
    'click input': function () {
      // debug testing; should be done on server
      //WorkstationSessions.update(workstationSession, {userBarcode: 'abc', dishBarcode: 'cde'});
      
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  var sessionCursor = WorkstationSessions.find();
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
  });
}
