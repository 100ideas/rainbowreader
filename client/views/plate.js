Template.plate.created = function () {
  console.log("plate.js: Template.plate created... ");
}

Template.plate.rendered = function () {
  console.log("plate.js: Template.plate rendered... ");
  createBackgroundSVG();
}

Template.plate.routes = function () {
  var routes = new Array();
  var view = "";
  var state = false;
  for (var p in Template.plate) {
    if (p.indexOf('show') === 0) {
      Session.get("multiViewMode") ? state = true : state = Template.plate[p];
      view = p.charAt(4).toLowerCase() + p.substring(5),
      routes.push({"view": view, "state": state});
    }
  }
  
  var rs = {};

  routes.forEach( function (r){ rs[r.view] = r.state(); });
  Session.set("routerState", rs);

  return routes;
}


/////////////////////////////////////////////////////////////////////
// EVENT HANDLERS

Template.plateHello.events({
  'click button': function () {
    Session.set("helloButtonClicked",true)
    fakeUserBarcode();
   }
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
