Template.platePhoto.created = function () {
  console.log("plate.js: Template.platePhoto created... ")
}

Template.platePhoto.rendered = function () {

  WorkstationSessions.find().observe({
    changed: function(newDocument, oldDocument) {
      
      // trigger background umage update when photo us available
      if (newDocument.photoURL != oldDocument.photoURL) {
        console.log("platePhoto.js: we've got a photo! " + newDocument.photoURL);
        changeBackgroundImg(newDocument.photoURL);
      }

      // trigger reticules when colonyData field is updated
      if (newDocument.colonyData && !oldDocument.colonyData) {
        console.log("platePhoto.js: observed a change in colonyData calling reticule animations");
        animateReticulesOnPlatePhoto();
        Meteor.setTimeout(function(){Session.set("reticulesDone",true);}, 3000);
      }
    }
  })

}


changeBackgroundImg