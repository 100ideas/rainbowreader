Template.plate.created = function () {
  console.log("plate.js: Template.plate created... ");
}

Template.plate.rendered = function () {
  console.log("plate.js: Template.plate created... ");
}

Template.plate.routes = function () {
  var routes = new Array();
  var state = false;
  for (var p in Template.plate) {
    if (p.indexOf('show') === 0) {
      Session.get("multiViewMode") ? state = true : state = Template.plate[p];
      routes.push({
        "view": p.charAt(4).toLowerCase() + p.substring(5),
       "state": state 
     });
    }
  }
  
  return routes;
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
// https://www.discovermeteor.com/blog/blaze-dynamic-template-includes/
// viewStates = ['viewsMenu', 'adminMenu', 'categoriesMenu'];

  // {{#each viewStates}}
  //   <li>
  //     {{> UI.dynamic template=templateName data=dataContext}}
  //   </li>
  // {{/each}}


