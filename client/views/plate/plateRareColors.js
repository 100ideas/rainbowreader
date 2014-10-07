Template.plateRareColors.listRareColors = function(){

  var doc = getSessionDocument();

  var rareColonies = doc.rareColorIndices.map(function(index) {
    return doc.colonyData[index];
  })

  return rareColonies;

};

Template.plateRareColors.events({
  'click #rareColorsButton': function() {
    var transitionTime = 2000;
    Meteor.call('insertExperiment')
    Meteor.setTimeout(function() {
      $('#bg-photo-container').addClass('blurred') 
    }, transitionTime)
    d3.select('#bg-photo-container svg').selectAll('circle')
      .transition()
      .duration(transitionTime)
      .attr('cy', '-1000')
    d3.select('#bg-photo-container svg').selectAll('line')
      .transition()
      .duration(transitionTime)
      .attr('y1', '-1000')
      .attr('y2', '-1000')

    // reload the page after a short time 
    var refreshTimeout = Meteor.settings.public.refreshTimeout || 8000;
    Meteor.setTimeout(function() { location.reload() }, refreshTimeout)
  }
})


Template.rareColorCard.rendered = function(){
}

Template.rareColorCard.totalColonies = function(){
  return getSessionDocument().coloniesCountAtThisTime;
}

// var hueToHsl = function(hue) {return "hsl(" + hue + ",50%,50%)";}

Template.rareColorCard.idName = function(colorName){

  return colorName.replace(/\s+/g, ''); //removing spaces for it to be a valid ID

}



Template.plateRareColors.drawCircle2 = function(hue, saturation, colorName){

  Meteor.setTimeout(function(){ //making sure previous template has loaded (waiting for the race condition.)

  var id = colorName.replace(/\s+/g, '');

  var saturationPercent = (saturation / 255) * 100;
  saturationPercent = saturationPercent.toFixed(2);
  var canvas = document.getElementById(id);
      var context = canvas.getContext('2d');
      var centerX = canvas.width / 2;
      var centerY = canvas.height / 2;
      var radius = canvas.width / 3;

      context.beginPath();
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      context.fillStyle = 'hsl(' + hue + ',' + saturationPercent + '%,50%)';
      context.fill();
      context.lineWidth = 2;
      context.strokeStyle = '#003300';
      context.stroke();

   },10);
}

Template.plateRareColors.drawCircle = function(Rmean, Gmean, Bmean, colorName){
  Meteor.setTimeout(function(){ //making sure previous template has loaded (waiting for the race condition.)
    var id = colorName.replace(/\s+/g, '');

    var color = d3.rgb(Rmean, Gmean, Bmean);

    // TODO dynamically set size of .colony-ball to fit in user window (or just pick big vs small preset)
    var circleStyles = {
      "background-color": color.toString(),
      "box-shadow":
        "-5px 5px 30px rgba(" + color.r + "," + color.g + "," + color.b + "," + "0.5)," +
        "50px -50px 50px rgba(0, 0, 0, .2) inset"
    };
    
    $("#" + id).css(circleStyles);

    var h2Styles = {
      color: "rgb(" + color.r + "," + color.g + "," + color.b + ")"
    }

    $("#" + id + "+ h2").css(h2Styles);

   },10);
}





