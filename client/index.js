// get the state document id from the server
Meteor.call('createWorkstationSession', function(error, result) {
   workstationSession = result;

  // bypass entering barcodes and clicking take Picture 
  
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