Template.plate.created = function () {
  console.log("plate.js: Template.plate created... ");
}

Template.plate.rendered = function () {
  console.log("plate.js: Template.plate rendered... ");
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
  'click button': function () {

     Session.set("helloButtonClicked",true);
     fakeBarcodeScan() }
});

Template.plateInstructions.events({
  'click button': function () {
    console.log('plateInstructions: taking photo');
    Session.set("instructionsButtonClicked",true);
    Meteor.call('takeAndAnalyzePhoto', getSessionDocument().plateBarcode);
  }
});

Template.plateAnalysis.events({
  'click button': function() {
    Session.set("analysisButtonClicked",true);
  }
});

Template.plateRareColors.events({
  'click button': function() {
    Session.set("rareColorsButtonClicked",true);
  }
});

/////////////////////////////////////////////////////////////////////
// Created / Rendered callbacks

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
