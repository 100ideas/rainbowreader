Template.header.created = function () {
  console.log("main.js: Template.header created... ");
}

Template.header.rendered = function () {
  console.log("main.js: Template.header finished rendering... ");
  this.autorun( function (){
    console.log("main.js: Template.header autorun function executed...");
  });  
}