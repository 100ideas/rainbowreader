/////////////////////////////////////////////////////////////////////
//d3 code for drawing circles in the middle section of the plateview
// these functions are called above, can they live somewhere else
// for clarity?


function hslaify(d) {
  return "hsla(" + d.Hue + ",50%,50%,1)";
}

// draw a reticle around each colony
animateReticulesOnPlatePhoto = function animatePetriDish() {
  console.log("reticuleAnimation.js: entering animatePetriDish");
  var svg = d3.select('#photo-container').append('svg')
      // .attr("width", 1296) // $("#photo-container").width() )
      // .attr("height", 972) // $("#photo-container").height() )
      .attr("width", $("#plate-photo").width() )
      .attr("height", $("#plate-photo").height() )
      .style("top", $("#plate-photo").height() * -1 )

  var colonySelector = svg.selectAll('circle')
    .data(WorkstationSessions.findOne().colonyData)
    .enter();

  drawReticle(colonySelector);
}

function drawReticle(selector) {
  var reticleWidth = '2px';
  var reticleRadiusMultiplier = 1.7; // how much bigger the reticle is than the colony
  var reticleInsideFraction = 0.4;   // portion of the reticle radius that the lines extend inside the reticle
  var reticleOutsideFraction = 0.5;  // portion of the reticle radius that the lines extend ouside the reticle
  var reticleAnimDuration = 3000;    // reticle animation length
  var reticleInitialMultiplier = 2000;
  // js dom wackiness to get original height of img with id="photo-container"
  // then use this to scale the svg overlay to the displayed size of the css responsive img
  var scaleFactor = $("#photo-container").width() / document.getElementById($("#plate-photo").attr("id")).naturalWidth;

  // partial computations
  var reticleInside = (1 - reticleInsideFraction) * reticleRadiusMultiplier;
  var reticleOutside = (1 + reticleOutsideFraction) * reticleRadiusMultiplier;

  // draw quadrant edges of reticle
  function reticleLine(selector, x1, y1, x2, y2) {
    selector
      .append("line")
      .style('stroke', 'cyan')
      .style('stroke-width', reticleWidth)
      .attr("x1", function(d) {return d.X * scaleFactor + x1 * d.Radius * reticleInitialMultiplier})
      .attr("y1", function(d) {return d.Y * scaleFactor + y1 * d.Radius * reticleInitialMultiplier})
      .attr("x2", function(d) {return d.X * scaleFactor + x2 * d.Radius * reticleInitialMultiplier})
      .attr("y2", function(d) {return d.Y * scaleFactor + y2 * d.Radius * reticleInitialMultiplier})
      .transition()
      .duration(reticleAnimDuration  *  0.75)
      .attr("x1", function(d) {return d.X * scaleFactor + x1 * d.Radius})
      .attr("y1", function(d) {return d.Y * scaleFactor + y1 * d.Radius})
      .attr("x2", function(d) {return d.X * scaleFactor + x2 * d.Radius})
      .attr("y2", function(d) {return d.Y * scaleFactor + y2 * d.Radius})
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
    .attr('cx', function(d) {return d.X * scaleFactor})
    .attr('cy', function(d) {return d.Y * scaleFactor})
    .transition()
    .duration(reticleAnimDuration)
    .attr('r', function(d) { return (d.Radius * reticleRadiusMultiplier)})
    .attr('cx', function(d) {return d.X * scaleFactor})
    .attr('cy', function(d) {return d.Y * scaleFactor})

}



//drawCirclesOnPlatePhoto = function drawCircles(){
//  console.log("reticuleAnimation.js: entering drawCircles();");
//  var circleSVG = d3.select("#photo-container")
//    .append("svg")
//       .attr("width", $("#photo-container").width() )
//       .attr("height", $("#photo-container").height() )
//      //.attr("width", '100%' )
//      //.attr("height", '100%' );
//
//  // console.log("data: " + WorkstationSessions.findOne(workstationSession).colonyData);
//
//  var colonySelector = circleSVG.selectAll('circle')
//    .data(WorkstationSessions.findOne().colonyData)
//    .enter();
//
//  colonySelector
//    .append('circle')
//    .style('fill', function(d){return hslaify(d)})
//    .style('stroke', 'black')
//    //.style('stroke-width', reticleWidth)
//    .attr('r', function(d){return d.Radius;}) //function(d) {return (d.Radius * reticleRadiusMultiplier)})
//    .attr('cx', function(d) {return d.X / 4})
//    .attr('cy', function(d) {return d.Y / 4});
//    //    .transition()
//    //    .duration(1000)
//    //    .attr('r', function(d) { return (d.Radius)})
//}
