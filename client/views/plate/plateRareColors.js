Template.plateRareColors.listRareColors = function(){

  var doc = getSessionDocument();

  var rareColonies = doc.rareColorIndices.map(function(index) {
    return doc.colonyData[index];
  })

  return rareColonies;

};


Template.rareColorCard.rendered = function(){


    console.log("rareColorCard.rendered entered");
    Template.rareColorCard.drawCircle();

}

var hueToHsl = function(hue) {return "hsl(" + hue + ",50%,50%)"}

Template.rareColorCard.drawCircle = function(){
  
    console.log("in Template.rareColorCard.drawCircle");

    var svg = d3.select('#colorCircle').append("svg")
        .attr("width",50)
        .attr("height",50);

var circle = svg.selectAll("circle")
    .data([10,100,200])
    

    circle.enter()
    .append("circle")
    .style('fill',function(d){
   
      console.log(d);
      console.log(hueToHsl(d));
      return hueToHsl(d); })
    .attr("r",20);
  
    
}