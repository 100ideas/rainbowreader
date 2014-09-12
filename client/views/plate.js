Template.plate.created = function () {
  console.log("plate.js: Template.plate created... ");
}

/////////////////////////////////////////////////////////////////////
// EVENT HANDLERS

Template.plateHello.events({
  'click button': function () { fakeBarcodeScan() }
});

Template.plateMeasurementInstructions.events({
  //'click button': function () {
  //  Meteor.call('takeAndAnalyzePhoto', getSessionDocument().plateBarcode);
  //}
});


/////////////////////////////////////////////////////////////////////
// Created / Rendered callbacks

Template.platePhoto.created = function () {
  console.log("plate.js: Template.platePhoto created... ");
}

Template.platePhoto.rendered = function () {
  console.log("platePhoto.js: Template.platePhoto.rendered callback: calling reticule animations")
  drawCirclesOnPlatePhoto();
  animateReticulesOnPlatePhoto();
  this.autorun( function (){
    console.log("platePhoto.js: Template.platePhoto autorun function executed...");
    drawCirclesOnPlatePhoto();
    animateReticulesOnPlatePhoto();
  });
}
