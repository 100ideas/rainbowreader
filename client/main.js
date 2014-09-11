// get the state document id from the server
Meteor.call('createWorkstationSession', function(error, result) {
   workstationSession = result;

  // bypass entering barcodes and clicking take Picture 
  debugEnterBarcodes();
  
  /*  while (!getSessionDocument()){
      //            Meteor.setTimeout(
      //      function(){console.log("missing dishBarcode");}, 100);
      };*/

  Meteor.setTimeout(function() {
    console.log("about to takeAndAnalyzePhoto");
    Meteor.call('takeAndAnalyzePhoto', getSessionDocument().dishBarcode);
  },2000);

  // watch the record for changes, so we can animate when colonyData arrives
  WorkstationSessions.find(workstationSession).observeChanges({
    changed: function(id, fields) {
      if (fields.colonyData) {
        // moved animation functions to lib/reticuleAnimation.js, called from plate.js
        // initialized with Template.plate.created
        // kept updated by hooking into plate.autorun (http://docs.meteor.com/#template_autorun)
        // 
        // if we have colonyData, we're ready to animate
        // drawCirclesOnPlatePhoto();
        // animateReticulesOnPlatePhoto();
      } 
    }  
  })

});

// Helper for retrieving state.  There should only be one document in this collection.
// -- moved to client/lib/globalHelpers so this function loads before other view Managers (i.e. plate.js)
// function getSessionDocument() {
//   return WorkstationSessions.findOne(workstationSession);
// }

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
Template.hello.showPlatePhoto = function () {
  var doc = getSessionDocument();
  if (!doc || !doc.photoURL) return false;
  return doc.photoURL;
};

/////////////////////////////////////////////////////////////////////
// EVENT HANDLERS

Template.hello.events({
  // TODO how is this function hooked up to the Take Photo button?
  // take a photograph and analyze it on the server;
  // we will receive colonyData through {{colonyData}} handlebars
  'click input': function () {
    Meteor.call('takeAndAnalyzePhoto', getSessionDocument().dishBarcode);
  }
});

/////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS

// DEBUG: for inputting barcodes without a scanner
debugEnterBarcodes = function() {
  var b = Date.now();
  console.log('debug mode: setting fake barcode as current date: ' + b);
  WorkstationSessions.update(workstationSession, {$set: {userBarcode: b, dishBarcode: b}});

}

Template.hello.created = function () {
  console.log("main.js: Template.hello created... ");
}

Template.hello.rendered = function () {
  console.log("main.js: Template.hello finished rendering... ");
  this.autorun( function (){
    console.log("main.js: Template.hello autorun function executed...");
  });  
}

Template.header.created = function () {
  console.log("main.js: Template.header created... ");
}

Template.header.rendered = function () {
  console.log("main.js: Template.header finished rendering... ");
  this.autorun( function (){
    console.log("main.js: Template.header autorun function executed...");
  });  
}

