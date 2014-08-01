console.log("loaded client/lib/globalHelpers.js")

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

// Helper for retrieving state.  There should only be one document in this collection.
// used to be in client/main.js
getSessionDocument = function () {
  return WorkstationSessions.findOne(workstationSession);
}
