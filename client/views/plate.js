Template.plate.created = function () {
  console.log("plate.js: Template.plate created... ");
}

/////////////////////////////////////////////////////////////////////
// EVENT HANDLERS

Template.plateHello.events({
  'click button': function () { fakeBarcodeScan() }
});

Template.plateInstructions.events({
  'click button': function () {
    console.log('plateInstructions: taking photo');
    Meteor.call('takeAndAnalyzePhoto', getSessionDocument().plateBarcode);
  }
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



// working on template to auto-render helpers 
// viewStates = ['viewsMenu', 'adminMenu', 'categoriesMenu'];

//   {{#each viewStates}}
//     <li>
//       {{> UI.dynamic template=templateName data=dataContext}}
//     </li>
//   {{/each}}


// get
// for (var name in myObject) {
//   if (myObject.hasOwnProperty(name)) {
//     alert(name);
//   }
// }
