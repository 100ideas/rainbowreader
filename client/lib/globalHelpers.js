// Global function for retrieving state.
// There should only be one document in this collection.
// used to be in client/main.js - mac
getSessionDocument = function () {
  var ws = WorkstationSessions.findOne(workstationSession);
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

Template.registerHelper('barcodeSuccess', function() {
  var r = {};
  r.user = getSessionDocument().userBarcode ? "success" : "";
  r.plate = getSessionDocument().plateBarcode ? "success" : "";
  return r;
});

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
  console.log("fakeUserBarcode: workstationSession: " + workstationSession);
  WorkstationSessions.update(workstationSession, {$set: {userBarcode: fakeBarcode}});
}

fakePlateBarcode = function () {
  var fakeBarcode = 'D' + Date.now();
  console.log("fakePlateBarcode: setting a fake plateBarcode: " + fakeBarcode);
  console.log("fakePlateBarcode: workstationSession: " + workstationSession);
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
