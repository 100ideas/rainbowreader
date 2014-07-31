UI.registerHelper('logContext', function(template) {
	console.log("logContext helper: \n\ttemplate: " + template + "\n\t context: " + this);

	// always empty cause this is a global helper? need to get at the closure somehow or maybe 
	// crawl up the data context?
	//
	// var curtemp = UI._templateInstance();
	// console.log("current template: " + curtemp);
});