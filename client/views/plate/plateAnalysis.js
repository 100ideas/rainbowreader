//counts the number of coloinies in colonyData
//this is just the length of the colonyData array
Template.plateAnalysis.colonyCount = function(){
    var currentDoc = getSessionDocument();
    return currentDoc.colonyData.length;
}

//counting # of unique xkcd color labels
Template.plateAnalysis.colorCount = function(){
    var currentDoc = getSessionDocument();

    //way to keep track of what hue values we've seen.
    var colorObject = {};
    currentDoc.colonyData.forEach(function(element){
	    var color = element.ColorName;
	    if (colorObject.hasOwnProperty[color]) { return; }
	    colorObject[color] = 1;
	});
    
    //getting the number of elements in the object, which is the number of unique colors
    return Object.keys(colorObject).length;
}


Template.plateAnalysis.displayTime = function(){
    var currentDoc = getSessionDocument();
    var unixTime = currentDoc.dateCreated;
    var date = new Date(unixTime);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    var year = date.getFullYear();
    var month = months[date.getMonth() - 1];
    var day = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();

    if (hour<10) hour +=0;
    if (min<10) min += 0;
    if (sec<10) sec += 0;

    var time = month + ' ' + day + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}

Template.plateAnalysis.totalColonies = function(){
  if (Visualizations.find().fetch().length) {
    var stats = Visualizations.findOne({'id': 'stats'}) || {};
	  return stats.coloniesCount;
  }else{ 
    return Meteor.settings.public.environment != "museum" ? "1232*" : "eColor & visualizations not found";
  }
}

Template.plateAnalysis.colorCounts = function(){
  if (Visualizations.find().fetch().length) {
    var colorCounts = Visualizations.findOne({'id': 'colorCounts'}) || {};
    var statsObject = {};
    colorCounts = lodash(colorCounts).omit(["_id", "id"]);
    statsObject.uniqueColors = colorCounts.size();
    statsObject.totalColors = colorCounts.reduce(function(sum, num){return sum + num})  // same as coloniesCount, duh.
    return statsObject;
  }else{ 
    if(Meteor.settings.public.environment != "museum"){
      return {uniqueColors: "46*", totalColors: "1232*"}
    }
    return {uniqueColors: "eColor db not found", totalColors: "eColor db not found"}
  }
}

Template.plateAnalysis.rendered = function(){
  Meteor.setTimeout(function() {
    $("#plate-stats-list-group li").velocity("transition.slideDownIn", {
      duration: 1000, 
      stagger: 300,
      drag: true
    });
  }, 1000);
}

Tracker.autorun(function (c) {
  if (Session.equals("reticulesDone", true)){
    console.log("plateAnalysis autorun");
  c.stop();
  }
});
