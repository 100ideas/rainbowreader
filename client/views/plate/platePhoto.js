Template.platePhoto.created = function () {
  console.log("plate.js: Template.platePhoto created... ")
}

Template.platePhoto.rendered = function () {

  // $('#photo-container').css('background-image', "url('" + WorkstationSessions.findOne().photoURL + "')")

  WorkstationSessions.find().observe({

    changed: function(newDocument, oldDocument) {

      // watch for colonyData field
      if (newDocument.colonyData && !oldDocument.colonyData) {

        console.log("platePhoto.js: Template.platePhoto.rendered callback: calling reticule animations");
        animateReticulesOnPlatePhoto();
        Meteor.setTimeout(function(){Session.set("reticulesDone",true);}, 10000);
      }
    }
  })

}