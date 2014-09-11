
// Global function for retrieving state.
// There should only be one document in this collection. 
// used to be in client/main.js - mac
getSessionDocument = function () {
  var ws = WorkstationSessions.findOne();

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
UI.registerHelper('logContext', function(template) {
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
UI.registerHelper('getSessionDocument', function() {
  return getSessionDocument();
});

/////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS for main.js and others :)

// DEBUG: for inputting barcodes without a scanner
debugEnterBarcodes = function() {
  var b = Date.now();
  console.log('debug mode: setting fake barcode as current date: ' + b);
  WorkstationSessions.update(workstationSession, {$set: {userBarcode: b, dishBarcode: b}});

}

// Helper for retrieving state.  There should only be one document in this collection.
// -- moved to client/lib/globalHelpers so this function loads before other view Managers (i.e. plate.js)
// function getSessionDocument() {
//   return WorkstationSessions.findOne(workstationSession);
// }

// takes barcode and determines whether it's dishBarcode or userBarcode
function determineBarcodeType(barcode) {
  if (barcode[0] == 'D') return 'dishBarcode';
  return 'userBarcode';
}


