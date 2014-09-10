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

	  console.log("in takeAndAnalyzePhoto");

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


      console.log("before runOpenCFU");

      runOpenCFU(photoPath, Meteor.bindEnvironment(function(colonyData) {
	
		    console.log("inside the Meteor.bindEnvironment callback for runOpenCFU");

        WorkstationSessions.update(workstationSession, {$set: {colonyData: colonyData}});

        analyzeColonies(colonyData);

        var userBarcode = WorkstationSessions.findOne(workstationSession).userBarcode;
        postColonyDataAndImage(dishBarcode, userBarcode, colonyData, photoPath);
	      }));
	    }));
	}
});

function analyzeColonies(colonyData) {
  // parse colors in workstationSession
  // assignCommonNames: iterate over colonyDate and add to each array item
  // findRarestColor: compare current colonies to all in db and pick rarest
  //                  update colonydata.rarestColorIndex with array indices

  // TODO: retrieve colonyData from db query instead of it being passed in,
  // in case some other process has updated the db before us 
  
  console.log("entering analyzeColonies...");

  // assign each colony a color name
  colonyData.forEach(function(colony, index) {
    var rgb = [colony.Rmean, colony.Gmean, colony.Bmean];
    var name = getNameForColor(rgb);
    colony.ColorName = name;
    //console.log('index ' + index + ' setting: ' + field);
    //var field = '"colonyData.' + index + '.ColorName"';
    //WorkstationSessions.update(workstationSession, {$set: {field: name}});
  });

  // Updating the color on colonyData one at a time triggers observeChanges every time.
  // So insert modified data in one update... (and hope some one else isn't trying to modifying data at the same time).
  WorkstationSessions.update(workstationSession, {$set: {colonyData: colonyData}});
  
  // pick the "rarest" 3 colors among these colonies
  // TODO: make this calculation use all colonies in the last X days
  // Use an object as a map to count how many times each color name appears.
  // Then transfer the counts to an array which we sort.
  // The least common colors will be at the top.
  var numberOfRarestColors = 3;
  
  var colorNamesMap = {};
  colonyData.forEach(function(colony, index) {
    if (colorNamesMap[colony.ColorName] === undefined)
      colorNamesMap[colony.ColorName] = {count:1, colonyDataIndex:index};
    else
      colorNamesMap[colony.ColorName].count++;
  });

  // transfer the map's entries into an array
  var colorNamesArray = [];
  for (var key in colorNamesMap) {
    // make sure we don't get an inherited property
    if (colorNamesMap.hasOwnProperty(key)) {
      colorNamesArray.push(colorNamesMap[key]);
    }
  }

  // sort ascending by count
  colorNamesArray.sort(function(a, b) {
    return a.count - b.count;
  });

  // set the rarest 3 indices as an array in the db
  var rareColorIndices = [];
  var numberToChoose = Math.min(colorNamesArray.length, numberOfRarestColors); 
  for (var i = 0; i < numberToChoose; i < i++) {
    rareColorIndices.push(colorNamesArray[i].colonyDataIndex);
  }

  console.log("set rarest colonies: " + rareColorIndices);
  
  var set = {$set: {rareColorIndices:rareColorIndices}};
  WorkstationSessions.update(workstationSession, set);

  // TODO: calculate 'rarity' score and how many times this color has been seen before
}













