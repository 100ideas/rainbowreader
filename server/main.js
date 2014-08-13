//// TODO replace global function
////
//// hitlist:
//// takePhoto
//// runOpenCFU
//// postColonyDataAndImage


// code to run on server at startup
Meteor.startup(function () {

  // initialize barcode scanner
  // and write barcodes to workstationSession
  listenForBarcodes(function(barcode) {
    // ignore barcodes if there isn't a browser session
    // otherwise write to workstationSession
    // WARNING: workstationSession is {} if not browser session
    // because Meteor weirdness.
    console.log('server/main.js: workstationSession: ' + workstationSession);
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
    console.log('server/main.js creatNewWorkStationSession\n\told workstationSession: ' + workstationSession);
    WorkstationSessions.remove({});   //clear previous session documents
    workstationSession = WorkstationSessions.insert({dateCreated: Date.now()});
    console.log('\tnew workstationSession: ' + workstationSession);
    return workstationSession;
  },
  
  takeAndAnalyzePhoto: function(dishBarcode) {
    takePhoto(dishBarcode, Meteor.bindEnvironment(function(photoPath) {

      // TODO Explain what's going on in this function
      // convert '~/rainbowreader/public/photos/photo1.jpg'
      // to 'photos/photo1.jpg'
      var ixPhotos = photoPath.indexOf('photos/');
      if (ixPhotos === -1) {
        console.log('error parsing photo path into URL: ' + photoPath);
        return;
      }
      var photoURL = photoPath.slice(ixPhotos);

      WorkstationSessions.update(workstationSession,{$set: {photoURL: photoURL}});

      runOpenCFU(photoPath, Meteor.bindEnvironment(function(colonyData) {
        WorkstationSessions.update(workstationSession, {$set: {colonyData: colonyData}});

        analyzeColonies();

        var userBarcode = WorkstationSessions.findOne(workstationSession).userBarcode;
        postColonyDataAndImage(dishBarcode, userBarcode, colonyData, photoPath);
      }));
    }));
  }
});

function analyzeColonies(){
  // parse colors in workstationSession
  // assignCommonNames: iterate over colonyDate and add to each array item
  // findRarestColor: compare current colonies to all in db and pick rarest
  //                  update colonydata.rarestColorIndex with array indices
  
  WorkstationSessions.update( 
    workstationSession, {$set: { 
      "colonyData.0.colorName" : "atomic orange" 
    } 
  });
  
  console.log("entering analyzeColonies...");
}













