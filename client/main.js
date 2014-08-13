// get the state document id from the server
Meteor.call('createWorkstationSession', function(error, result) {
   workstationSession = result;

  // bypass entering barcodes and clicking take Picture 
  debugEnterBarcodes();
  


  /*  while (!getSessionDocument()){
      //            Meteor.setTimeout(
      //  	  function(){console.log("missing dishBarcode");}, 100);
      };*/

  Meteor.setTimeout(function(){Meteor.call('takeAndAnalyzePhoto', getSessionDocument().dishBarcode);},2000);


  // watch the record for changes, so we can animate when colonyData arrives
  WorkstationSessions.find(workstationSession).observeChanges({
    changed: function(id, fields) {
      if (fields.colonyData) {
        // if we have colonyData, we're ready to animate
        animatePetriDish();
        drawCircles();
      } 
    }  
  })
});

// Helper for retrieving state.  There should only be one document in this collection.
// -- moved to client/lib/globalHelpers so this function loads before other view Managers (i.e. plate.js)
// function getSessionDocument() {
//   return WorkstationSessions.findOne(workstationSession);
// }

///////////////////////////////////////////////////////////////////////////////
// STATE MACHINE / WORKFLOW template functions
// These are evaluated by the html to see what we should be showing when.
// Probably only one should evaluate to true at a time.

// starting state, so return true by default
Template.hello.showScanBarcodes = function () {
  var doc = getSessionDocument();
  if (!doc) return true;
  return !doc.dishBarcode || !doc.userBarcode;
}

// once we have scanned both barcodes, show instructions for taking photograph
Template.hello.showTakePhoto = function () {
  var doc = getSessionDocument();
  if (!doc) return false;
  return doc.userBarcode && doc.dishBarcode && !doc.photoURL;
}

// show the image and colony animations
Template.hello.showPlatePhoto = function () {
  var doc = getSessionDocument();
  if (!doc || !doc.photoURL) return false;
  return doc.photoURL;
};

/////////////////////////////////////////////////////////////////////
// EVENT HANDLERS

Template.hello.events({
  // TODO how is this function hooked up to the Take Photo button?
  // take a photograph and analyze it on the server;
  // we will receive colonyData through {{colonyData}} handlebars
  'click input': function () {
    Meteor.call('takeAndAnalyzePhoto', getSessionDocument().dishBarcode);
  }
});

/////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS

// DEBUG: for inputting barcodes without a scanner
debugEnterBarcodes = function() {
  var b = Date.now();
  console.log('debug mode: setting fake barcode as current date: ' + b);
  WorkstationSessions.update(workstationSession, {$set: {userBarcode: b, dishBarcode: b}});

}

// takes barcode and determines whether it's dishBarcode or userBarcode
function determineBarcodeType(barcode) {
  if (barcode[0] == 'D') return 'dishBarcode';
  return 'userBarcode';
}

/////////////////////////////////////////////////////////////////////
//d3 code for drawing circles in the middle section of the plateview
// these functions are called above, can they live somewhere else
// for clarity?

function drawCircles(){

  console.log("entering drawCircles();");

  var circleSVG = d3.select("#colonyspectrum").append('svg');

  // console.log("data: " + WorkstationSessions.findOne(workstationSession).colonyData);

  var colonySelector = circleSVG.selectAll('circle')
  .data(WorkstationSessions.findOne(workstationSession).colonyData)
  .enter()

  colonySelector
  .append('circle')
  .style('fill', function(d){return hslaify(d)})
    .style('stroke', 'black')
    //.style('stroke-width', reticleWidth)
    .attr('r', function(d){return d.Radius;}) //function(d) {return (d.Radius * reticleRadiusMultiplier)})
    .attr('cx', function(d) {return d.X / 4}) 
    .attr('cy', function(d) {return d.Y / 4})
    //    .transition()
    //    .duration(1000)
    //    .attr('r', function(d) { return (d.Radius)})
}          

function hslaify(d) {
  return "hsla(" + d.Hue + "," + d.Saturation + "%,50%,1)";  
}
    
// draw a reticle around each colony
function animatePetriDish() {
  console.log("main.js: entering animatePetriDish");
  var svg = d3.select('#viz').append('svg');

  var colonySelector = svg.selectAll('circle')
    .data(WorkstationSessions.findOne(workstationSession).colonyData)
    .enter()

  drawReticle(colonySelector);
}

function drawReticle(selector) {
  var reticleWidth = '2px';
  var reticleRadiusMultiplier = 1.7; // how much bigger the reticle is than the colony
  var reticleInsideFraction = 0.4;   // portion of the reticle radius that the lines extend inside the reticle
  var reticleOutsideFraction = 0.5;  // portion of the reticle radius that the lines extend ouside the reticle
  var reticleAnimDuration = 3000;    // reticle animation length
  var reticleInitialMultiplier = 2000;

  // partial computations
  var reticleInside = (1 - reticleInsideFraction) * reticleRadiusMultiplier;
  var reticleOutside = (1 + reticleOutsideFraction) * reticleRadiusMultiplier;

  // draw quadrant edges of reticle
  function reticleLine(selector, x1, y1, x2, y2) {
    selector
      .append("line")
      .style('stroke', 'cyan')
      .style('stroke-width', reticleWidth)
      .attr("x1", function(d) {return d.X + x1 * d.Radius * reticleInitialMultiplier})
      .attr("y1", function(d) {return d.Y + y1 * d.Radius * reticleInitialMultiplier})
      .attr("x2", function(d) {return d.X + x2 * d.Radius * reticleInitialMultiplier})
      .attr("y2", function(d) {return d.Y + y2 * d.Radius * reticleInitialMultiplier})
      .transition()
      .duration(reticleAnimDuration  *  0.75)
      .attr("x1", function(d) {return d.X + x1 * d.Radius})
      .attr("y1", function(d) {return d.Y + y1 * d.Radius})
      .attr("x2", function(d) {return d.X + x2 * d.Radius})
      .attr("y2", function(d) {return d.Y + y2 * d.Radius})
  }
  reticleLine(selector, 0, -reticleInside, 0, -reticleOutside);
  reticleLine(selector, 0,  reticleInside, 0,  reticleOutside);
  reticleLine(selector,  reticleInside, 0,  reticleOutside, 0);
  reticleLine(selector, -reticleInside, 0, -reticleOutside, 0);

  // draw the circle part of the reticle
  selector
    .append('circle')
    .style('fill', 'none')
    .style('stroke', 'cyan')
    .style('stroke-width', reticleWidth)
    .attr('r', 0)//function(d) {return (d.Radius * reticleRadiusMultiplier)})
    .attr('cx', function(d) {return d.X}) 
    .attr('cy', function(d) {return d.Y})
    .transition()

    .duration(reticleAnimDuration)
 
   .attr('r', function(d) { return (d.Radius * reticleRadiusMultiplier)})
}
