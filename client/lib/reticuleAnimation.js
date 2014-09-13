/////////////////////////////////////////////////////////////////////
//d3 code for drawing circles in the middle section of the plateview
// these functions are called above, can they live somewhere else
// for clarity?

drawCirclesOnPlatePhoto = function drawCircles(){
  console.log("reticuleAnimation.js: entering drawCircles();");
  var circleSVG = d3.select('#plate-photo')
    .append('svg')
      // .attr("width", $("#plate-photo").width() )
      // .attr("height", $("#plate-photo").height());
      .attr("width", '500px' )
      .attr("height", '500px' );

  // console.log("data: " + WorkstationSessions.findOne(workstationSession).colonyData);

  var colonySelector = circleSVG.selectAll('circle')
    .data(WorkstationSessions.findOne().colonyData)
    .enter();

  colonySelector
    .append('circle')
    .style('fill', function(d){return hslaify(d)})
    .style('stroke', 'black')
    //.style('stroke-width', reticleWidth)
    .attr('r', function(d){return d.Radius;}) //function(d) {return (d.Radius * reticleRadiusMultiplier)})
    .attr('cx', function(d) {return d.X / 4})
    .attr('cy', function(d) {return d.Y / 4});
    //    .transition()
    //    .duration(1000)
    //    .attr('r', function(d) { return (d.Radius)})
}

function hslaify(d) {
  return "hsla(" + d.Hue + "," + d.Saturation + "%,50%,1)";
}

// draw a reticle around each colony
animateReticulesOnPlatePhoto = function animatePetriDish() {
  console.log("reticuleAnimation.js: entering animatePetriDish");
  var svg = d3.select('#plate-photo').append('svg');

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
