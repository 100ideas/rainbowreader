// Global function for retrieving state.
// There should only be one document in this collection.
// used to be in client/main.js - mac
getSessionDocument = function () {
  var ws = WorkstationSessions.findOne(workstationSession);

  // WTF TDOD need to figure out race condition w/ WorkstationSessions
  // only a problem when server starts?
  //
  // if (!ws) {
  //   setTimeout(function() {
  //     console.log("getSessionDocument() helper called BUT NO WorkstationSession EXISTS YET!\n\ttimeout 1000");
  //     ws = WorkstationSessions.findOne();
  //   }, 5000);
  // }

  // called so often it takes over the console
  //console.log("getSessionDocument() helper called, _id: " + ws._id);
  return ws;
}

// global template helper for logging current context. Pass template name in as parameter
Template.registerHelper('logContext', function(template) {
  var currentContext = this;
  if (!template) {template = "no template name provided."};
  if (_.isObject(currentContext) ) {currentContext = "no context yet."};
  console.log("logContext helper: \n\ttemplate: " + template + "\n\t context: " + currentContext);

  // always empty cause this is a global helper? need to get at the closure somehow or maybe
  // crawl up the data context?
  //
  // var curtemp = UI._templateInstance();
  // console.log("current template: " + curtemp);
});

// global template helper for getting current workstationSession. Pass template name in as parameter
Template.registerHelper('getSessionDocument', function() {
  return getSessionDocument();
});

// Meteor.startup(function(){

//   getEnvironment = function(){
//     console.log("globalHelpers.js: in getEnvironment()")
//     var environment = Admin.findOne({}).environment;
//     return environment;
//   }
// });


// getEnvironment = function() {
//   console.log("globalHelpers.js: in getEnvironment()")
//   return Admin.findOne({}).environment; 
// }


// Template.registerHelper('notMuseum', function(){
//   var current_environment = Admin.findOne({}).environment;
//   console.log("gloabl notMuseum: " + current_environment);
//   museum = current_environment === 'museum' ? false : true;
//   return museum;
// });

// generates and inserts two random barcodes into current workstationSession
generateFakeBarcodes = function () {
  var fakeBarcode = 'D' + Date.now();
  console.log("generating fake barcodes for workstationSession: " + workstationSession);
  console.log("\tuserBarcode: " + fakeBarcode + " plateBarcode: " + fakeBarcode);
  WorkstationSessions.update(workstationSession, {$set: {userBarcode: fakeBarcode, plateBarcode: fakeBarcode}});
}

// generates and inserts either a random user or plate barcode into current workstationSession
fakeBarcodeScan = function () {
  if ( Math.random() * 2 > 1) {
    var fakeBarcode = 'U' + Date.now();
    console.log("fakeBarcodeScan: setting a fake userBarcode: " + fakeBarcode);
    WorkstationSessions.update(workstationSession, {$set: {userBarcode: fakeBarcode}});
  } else {
    var fakeBarcode = 'D' + Date.now();
    console.log("fakeBarcodeScan: setting a fake plateBarcode: " + fakeBarcode);
    WorkstationSessions.update(workstationSession, {$set: {plateBarcode: fakeBarcode}});
  }
}

fakeUserBarcode = function () {
  var fakeBarcode = 'U' + Date.now();
  console.log("fakeUserBarcode: setting a fake userBarcode: " + fakeBarcode);
  WorkstationSessions.update(workstationSession, {$set: {userBarcode: fakeBarcode}});
}

fakePlateBarcode = function () {
  var fakeBarcode = 'D' + Date.now();
  console.log("fakePlateBarcode: setting a fake plateBarcode: " + fakeBarcode);
  WorkstationSessions.update(workstationSession, {$set: {plateBarcode: fakeBarcode}});
}

// writes names of all templates to the log
logTemplates = function () {
  var userTemplates = new Array();
  var systemTemplates = new Array();
  for (var property in Template) {
    if (Template[property] instanceof Blaze.Template) {
      // system generated templates always start with '__' ?
      if (property.indexOf('__') === -1 ) {
        userTemplates.push(Template[property]);
      } else {
        systemTemplates.push(Template[property]);
      }
    }
  }
  console.log("user templates:")
  userTemplates.forEach(function(t){console.log("\t" + t.viewName)})
  console.log("system templates:")
  systemTemplates.forEach(function(t){console.log("\t" + t.viewName)})
}
