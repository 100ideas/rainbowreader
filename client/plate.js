Template.plate.created = function () {
  console.log("plate.js: Template.plate created... ");
}

Template.plate.rendered = function () {
  console.log("plate.js: Template.plate.rendered finished... callback executed...")
  drawCirclesOnPlatePhoto();
  animateReticulesOnPlatePhoto();
  this.autorun( function (){
    console.log("plate.js: Template.plate autorun function executed...");
    drawCirclesOnPlatePhoto();
    animateReticulesOnPlatePhoto();
  });
}

/////////////////////////////////////////////////////////////////////
// EVENT HANDLERS

Template.plate.events({
  // TODO how is this function hooked up to the Take Photo button?
  // take a photograph and analyze it on the server;
  // we will receive colonyData through {{colonyData}} handlebars
  'click input': function () {
    Meteor.call('takeAndAnalyzePhoto', getSessionDocument().dishBarcode);
  }
});