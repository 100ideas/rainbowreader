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
    //Session.set("helloButtonClicked",true)
    fakeUserBarcode();
    uiAdvanceState();
  }
});

Template.plateIntroduction.events({
  'click button': function () {
    console.log('plateIntroduction button clicked');
    //Session.set("introductionButtonClicked",true);
    uiAdvanceState();
  }
});

Template.plateInstructions.events({
  'click button': function () {
    console.log('plateInstructions: taking photo');
    //Session.set("instructionsButtonClicked",true);
    uiAdvanceState();
    Meteor.call('takeAndAnalyzePhoto', getSessionDocument().plateBarcode);
  }
});

Template.plateAnalysis.events({
  'click button': function() {
    var rareColors = getSessionDocument().colonyData.slice(0,3).map(function(d) {return d.ColorName});
    // console.log(rareColors);
    //Session.set("analysisButtonClicked",true);
    uiAdvanceState();
    d3.select('#bg-photo-container svg').selectAll('circle')
      .transition()
      .style('stroke', function(d) {
        // console.log(d);
        // console.log(rareColors.indexOf(d.ColorName));
        return (rareColors.indexOf(d.ColorName) != -1) ? 'red' : 'cyan'})
      .style('stroke-width', function(d) {return (rareColors.indexOf(d.ColorName) != -1) ? '5px' : '1px'});
    d3.select('#bg-photo-container svg').selectAll('line')
      .transition()
      .style('stroke', function(d) {return (rareColors.indexOf(d.ColorName) != -1) ? 'red' : 'cyan'})
      .style('stroke-width', function(d) {return (rareColors.indexOf(d.ColorName) != -1) ? '5px' : '1px'})
  }
});

Template.plateRareColors.events({
  'click button': function() {
    //Session.set("rareColorsButtonClicked",true);
    uiAdvanceState();
  }
});
