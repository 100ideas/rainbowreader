Template.plateRareColors.listRareColors = function(){

  var doc = getSessionDocument();

  var rareColonies = doc.rareColorIndices.map(function(index) {
    return doc.colonyData[index];
  })

  return rareColonies;

};

Template.plateRareColors.events({
  'click #rareColorsButton': function() {
    Meteor.call('insertExperiment')
  }
})


Template.rareColorCard.rendered = function(){
  console.log("rareColorCard.rendered entered");
}

Template.rareColorCard.totalColonies = function(){
  return getSessionDocument().coloniesCountAtThisTime;
}

var hueToHsl = function(hue) {return "hsl(" + hue + ",50%,50%)";}

Template.rareColorCard.idName = function(colorName){

  return colorName.replace(/\s+/g, ''); //removing spaces for it to be a valid ID

}



Template.plateRareColors.drawCircle = function(hue, saturation, colorName){

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
