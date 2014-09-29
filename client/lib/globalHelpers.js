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

Meteor.startup(function(){

  getEnvironment = function(){
    var environment = Admin.findOne({}).environment;
    return environment;
  }
});
/*Template.registerHelper('getEnvironment', function(){

  return getEnvironment();

});*/

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
    console.log("fakeBarcodeScan: setting a fake barcodes userBarcode: " + fakeBarcode);
    WorkstationSessions.update(workstationSession, {$set: {userBarcode: fakeBarcode}});
  } else {
    var fakeBarcode = 'D' + Date.now();
    console.log("fakeBarcodeScan: setting a fake barcodes plateBarcode: " + fakeBarcode);
    WorkstationSessions.update(workstationSession, {$set: {plateBarcode: fakeBarcode}});
  }
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
