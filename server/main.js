// code to run on server at startup
Meteor.startup(function () {

  // don't need static server if we're not on museum ubuntu box
  if (Meteor.settings.public.environment === 'museum') {
    var localPhotosPath = Meteor.settings.public.platePhotosPath || '/photos/';
    StaticServer.add('/photos', localPhotosPath);
  }

  // initialize barcode scanner
  // and write barcodes to workstationSession
  listenForBarcodes(function(barcode) {
    // ignore barcodes if there isn't a browser session
    // otherwise write to workstationSession
    // WARNING: workstationSession is {} if not browser session
    // because Meteor weirdness.
    console.log("server/main.js: listenForBarcodes callback triggered\n\tworkstationSession: " +
                workstationSession + "\n\tbarcode: " + barcode);

    if (typeof workstationSession === 'string') {
      try {
        // choose the property name based on the type of barcode
        var name = determineBarcodeType(barcode);
        var field = {};
        field[name] = barcode;
        WorkstationSessions.update(workstationSession, {$set: field});
      }
      catch(ex) {
        console.log('exception updating workstationSession: ' + ex);
      }
    }
  });
});

Meteor.methods({
  createWorkstationSession: function() {
    // create a single mongo document to hold state between server and client
    console.log('server/main.js:');
    WorkstationSessions.remove({});   //clear previous session documents
    workstationSession = WorkstationSessions.insert({dateCreated: Date.now()});
    console.log('\tnew workstationSession: ' + workstationSession);
    return workstationSession;
  },

  insertExperiment: function(){
    // copy all the fields into a record in Experiments (used by the visualization)
    var record = WorkstationSessions.findOne(workstationSession);
    Experiments.insert(record);
    console.log('server/main.js:\n\tnew experiment inserted into db');

  },
  takeAndAnalyzePhoto: function(plateBarcode) {
    // takePhoto will return a bool indicating success
    // return its result to the caller in the browser in case the camera fails
    return takePhoto(plateBarcode, Meteor.bindEnvironment(

      function(photoPath) {
        console.log("server/main.js:takeAndAnalyzePhoto");
        if(!photoPath) {
          console.log("\tError taking photo.");
          WorkstationSessions.update(workstationSession, {$set: {photoError: true}});
          return;
        }

        // assume we have mapped file system /photos to http /photos
        var photoURL = photoPath;
        // if not, parse the path specified in settings.js file
        if (! (Meteor.settings.environment === 'museum')) {
          photoURL = Meteor.settings.fakeColonyPhotoFile;
          console.log("\t$METEOR_ENV is not \'museum\'");
        }

        console.log("\tset WorkstationSession photoURL: " + photoURL);
        WorkstationSessions.update(workstationSession, {$set: {photoURL: photoURL}});

        runOpenCFU(photoPath, Meteor.bindEnvironment(
          function(colonyData) {
            // delay writing colonyData to db until we've calculated rare colors
            //WorkstationSessions.update(workstationSession, {$set: {colonyData: colonyData}});
            console.log("\tOpenCFU found " + colonyData.length + " colonies")
            analyzeColonies(colonyData);
          }
        ));

      }
    ));
  }
});

// takes barcode and determines whether it's plateBarcode or userBarcode
function determineBarcodeType(barcode) {
  if (barcode[0] == '9') return 'userBarcode';
  return 'plateBarcode';
}
