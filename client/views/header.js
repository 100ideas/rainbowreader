Template.header.created = function () {
  console.log("main.js: Template.header created... ");
}

Template.header.rendered = function () {
  console.log("main.js: Template.header finished rendering... ");
  this.autorun( function (){
    console.log("main.js: Template.header autorun function executed...");
  });  
}

Template.header.routerStates = function () {
  var showLogic = new Array();
  for (var p in Template.plate) {
    if (p.indexOf('show') === 0) {
      showLogic.push({"route": p, "routeState": Template.plate[p] });
    }
  }
  // OMFG routing
  showLogic.splice(3, 0, {"route": "showPlateAnalysis", "routeState": Template.platePhoto.showPlateAnalysis });
  return showLogic;
}