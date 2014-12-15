/////////////////////////////////////////////////////////////////////
// Methods to set up, add, and animate background photo of plate.
// 

function hslaify(d) {
  return "hsla(" + d.Hue + ",50%,50%,1)";
}

// initialize background image
// called in plate.js: Template.plate.rendered()
createBackgroundSVG = function () {
  console.log("reticuleAnimation.js:\n\tcreating background svg");

  // set dimensions of full size photos here (small.jpg is 2100x1400)
  var photoWidth = Meteor.settings.public.photoWidth;
  var photoHeight = Meteor.settings.public.photoHeight;

  var svg = d3.select('#bg-photo-container').insert('svg', ':first-child')
    .attr("width", "100%")
    .attr("height", "100%" )
    .attr("viewBox", "0 0 " + photoWidth + " " + photoHeight)     
    .attr("preserveAspectRatio", "xMinYMid slice") 
      .append("svg:image")
      .attr("id", "bg-photo")
      .attr("xlink:href", 'photos/bg_no_plate.jpg')
      .attr("width", photoWidth)
      .attr("height", photoHeight);

  // http://www.tnoda.com/blog/2013-12-07
  // keep our svg background responsive        
  // $(window).resize(function() {
  //   d3.select('svg')
  //     .attr("width", $(window).width() )
  //     .attr("height", $(window).height() );
  // });
}

// called in platePhoto.js: Template.platePhoto.rendered() inside
// WorkstationSessions.find().observe() callback TODO not always triggered?
changeBackgroundImg = function (img) {
  
  if (!img) {
    if ($('#bg-photo').attr("href") === undefined) {
      img = 'photos/bg_no_plate.jpg'
      console.log("switching background image to:" + img);
      d3.select('#bg-photo').attr("xlink:href", img);
      return "disable bg";
    } else {
      console.log("switching background image to black ");
      d3.select('#bg-photo').attr("xlink:href", img);
      return "enable bg";
    }
  };

  if (img === 'bill') {
    if ($('#bg-photo').attr("href") === "http://www.fillmurray.com/1250/700") {
      img = 'photos/bg_no_plate.jpg'
      d3.select('#bg-photo').attr("xlink:href", img);        
      return 'bill me';
    } else {
      img = "http://www.fillmurray.com/1250/700";
      d3.select('#bg-photo').attr("xlink:href", img);  
      return 'unbill me';
    }
  }
  console.log("switching background image to:" + img);
  d3.select('#bg-photo').attr("xlink:href", img);  
}


// draw a reticle around each colony
// called in platePhoto.js: Template.platePhoto.rendered() inside
// WorkstationSessions.find().observe() callback
animateReticulesOnPlatePhoto = function animatePetriDish() {

  Session.set("reticulesDone",false); // https://github.com/mbostock/d3/wiki/Transitions#each
  var duration = Meteor.settings.public.reticuleDuration;

  var colonySelector = d3.select('#bg-photo-container svg').selectAll('circle')
    .data(WorkstationSessions.findOne().colonyData)
    .enter();

  drawReticle(colonySelector, duration);
}

function drawReticle(selector, duration) {
  var reticleColor = 'yellow';

  var reticleWidth = '1px';
  var reticleRadiusMultiplier = 1.7; // how much bigger the reticle is than the colony
  var reticleInsideFraction = 0.4;   // portion of the reticle radius that the lines extend inside the reticle
  var reticleOutsideFraction = 0.5;  // portion of the reticle radius that the lines extend ouside the reticle
  var reticleAnimDuration = duration || 3000;    // reticle animation length, default 3000
  var reticleInitialMultiplier = 2000;

  
  // time in ms between successive reticle animations
  var delay = duration || 100

  // partial computations
  var reticleInside = (1 - reticleInsideFraction) * reticleRadiusMultiplier;
  var reticleOutside = (1 + reticleOutsideFraction) * reticleRadiusMultiplier;

  // draw quadrant edges of reticle
  function reticleLine(selector, x1, y1, x2, y2) {
    selector
      .append("line")
      .style('stroke', reticleColor)
      .style('stroke-width', reticleWidth)
      .attr("x1", function(d) {return d.X + x1 * d.Radius * reticleInitialMultiplier})
      .attr("y1", function(d) {return d.Y + y1 * d.Radius * reticleInitialMultiplier})
      .attr("x2", function(d) {return d.X + x2 * d.Radius * reticleInitialMultiplier})
      .attr("y2", function(d) {return d.Y + y2 * d.Radius * reticleInitialMultiplier})
      .transition()
      .duration(reticleAnimDuration  *  0.75)
      .delay(function(d,i) {return i * delay})
      .attr("x1", function(d) {return d.X + x1 * d.Radius})
      .attr("y1", function(d) {return d.Y + y1 * d.Radius})
      .attr("x2", function(d) {return d.X + x2 * d.Radius})
      .attr("y2", function(d) {return d.Y + y2 * d.Radius})
  }
  reticleLine(selector, 0, -reticleInside, 0, -reticleOutside);
  reticleLine(selector, 0,  reticleInside, 0,  reticleOutside);
  reticleLine(selector,  reticleInside, 0,  reticleOutside, 0);
  reticleLine(selector, -reticleInside, 0, -reticleOutside, 0);

  var tracker = {howMany: selector[0].length, soFar: 1};

  // draw the circle part of the reticle
  selector
    .append('circle')
    .style('fill', 'none')
    .style('stroke', reticleColor)
    .style('stroke-width', reticleWidth)
    .attr('r', 0)//function(d) {return (d.Radius * reticleRadiusMultiplier)})
    .attr('cx', function(d) {return d.X})
    .attr('cy', function(d) {return d.Y})
    .transition()
    .duration(reticleAnimDuration)
    .delay(function(d,i) {return i * delay})   
    .attr('r', function(d) { return (d.Radius * reticleRadiusMultiplier)})
    .attr('cx', function(d) {return d.X})
    .attr('cy', function(d) {return d.Y})
    .each('end', function(d) {
      tracker.soFar++;
      if (tracker.soFar > tracker.howMany) {
        // console.log("d3 end of animation? soFar: " + tracker.soFar + " howMany: " + tracker.howMany);
        Session.set("reticulesDone",true)
        console.log("animateReticulesOnPlatePhoto() finished, Session.reticulesDone? " + Session.get("reticulesDone"));
      }
      // console.log("d: " + d + "soFar: " + tracker.soFar + " howMany: " + tracker.howMany);
    })
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
