Template.plateRareColors.events({
  'click #rareColorsButton': function() {
    var transitionTime = Meteor.settings.public.reticuleDuration || 2000
    console.log('inserting Experiment in db')
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
    var restartAfterWallUpdate = Meteor.settings.public.restartAfterWallUpdate || 8000;
    Meteor.setTimeout(function() { location.reload() }, restartAfterWallUpdate)
  }
})

// Template.plateRareColors.rendered = function(){
//   this.find('#rare-colors')._uihooks = {
//     insertElement: function (node, next) {
//       var $node = $(node);
//       $node.insertBefore(next);
//       console.log("rareColorCard uihooks insertElement: node:" + node );
//       $node.velocity("transition.bounceRightIn", {
//         // duration: ,
//         // easing: ,
//         complete: function () {
//             $node = null;
//         }
//       });
//     }
//   }
// }


Template.plateRareColors.animateIn = function(){
  Meteor.setTimeout( function(){
    $(".rareColorCard").velocity("transition.slideDownIn", {
      duration: 1000, 
      stagger: 300,
      drag: true
    });
  }, 100);
}

Template.rareColorCard.listRareColors = function(){
  var doc = getSessionDocument();
  var rareColonies = doc.rareColorIndices.map(function(index) {
    return doc.colonyData[index];
  })
  return rareColonies;
};

Template.rareColorCard.totalColonies = function(){
  return getSessionDocument().coloniesCountAtThisTime;
}

// var hueToHsl = function(hue) {return "hsl(" + hue + ",50%,50%)";}

Template.rareColorCard.idName = function(colorName){
  return colorName.replace(/\s+/g, ''); //removing spaces for it to be a valid ID
}

Template.rareColorCard.drawCircle = function(Rmean, Gmean, Bmean, colorName){
  Meteor.setTimeout( function(){
    var id = colorName.replace(/\s+/g, '');
    var color = d3.rgb(Rmean, Gmean, Bmean);
    var h2Styles = { color: "rgb(" + color.r + "," + color.g + "," + color.b + ")"}
    var circleStyles = {
      "background-color": color.toString(),
      "box-shadow":
        "-5px 5px 30px rgba(" + color.r + "," + color.g + "," + color.b + "," + "0.5)," +
        "50px -50px 50px rgba(0, 0, 0, .2) inset"
    };
    $("#" + id).css(circleStyles);
    $("#" + id + "+ div h1").css(h2Styles);
  }, 10);
}

