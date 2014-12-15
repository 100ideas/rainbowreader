Template.platePhoto.created = function () {
}

Template.platePhoto.rendered = function () {

  // reset reticuleToggle
  //Session.set("reticulesDone",false);

  // trigger background umage update when photo us available
  var photoURL = getSessionDocument().photoURL
  if (photoURL) {
    console.log("platePhoto.js: we've got a photo! " + photoURL);
    changeBackgroundImg(photoURL);
  }

  WorkstationSessions.find().observe({
    changed: function(newDocument, oldDocument) {

      // TODO WTF weird - new and old doc _id and timestamps are always thes same?
      // console.log("platePhoto.js:\t_id\t\t\t\t\tdateCreated\t\tuserBarcode\t\tphotoURL" +
      //             "\n\toldDocument: " + oldDocument._id + "\t" + oldDocument.dateCreated + "\t" + oldDocument.userBarcode + "\t" + oldDocument.photoURL +
      //             "\n\tnewDocument: " + newDocument._id + "\t" + newDocument.dateCreated + "\t" + newDocument.userBarcode + "\t" + newDocument.photoURL);
      
      if (newDocument.colonyData && !oldDocument.colonyData) {
        console.log("platePhoto.js: observed a change in colonyData; calling animateReticulesOnPlatePhoto()");
        animateReticulesOnPlatePhoto();
        // Meteor.setTimeout(function(){Session.set("reticulesDone",true);}, 3000);
      }
    }
  })

}
