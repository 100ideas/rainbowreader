/*
Runs OpenCFU and asynchronously returns an array of JSON objects.

GLOBAL FUNCTIONS
++++++++++++++++
  runOpenCFU(filename, callback)
    runs OpenCFU on local image file
    callback takes a single JSON array
*/

var exec = Meteor.npmRequire('child_process').exec;
var csv = Meteor.npmRequire('csv');

// TODO wrap lines in debug
var fs = Meteor.npmRequire('fs');

// runs OpenCFU on local image file
// callback is passed single JSON array
runOpenCFU = function(filename, callback) {
  // looks for OpenCFU executable here
  var opencfuPath = Meteor.settings.opencfuPath;
  // run OpenCFU with parameters
  // TODO explain parameters
  var minRadius = 30;	// units are unclear
  var maxRadius = 200;
  var bilateralThreshold = 2;
  var cmd = opencfuPath + " -d bil -t " + bilateralThreshold + " -r " + minRadius + " -R " + maxRadius + " -i " + filename;

  if (Meteor.settings.opencfuPath) {

    console.log("server/opencfu.js: executing " + cmd )

    // run opencfu and save output
    // TODO change exec to spawn, because exec has limited output buffer
    var child = exec(cmd, Meteor.bindEnvironment(function (error, stdout, stderr) {
      if (error || stderr) {
        console.log("\tshit went down in the OpenCFU...");
        if (error) console.log("\terror: " + error);
        if (stderr) console.log("\tstderr: " + stderr);
      } else {
        // success. parse stdout with csv module and return JSON to callback
        // console.log("================================================\n\tgot stdout:\n " + stdout)
        console.log( "\tOpenCFU finished executing, calling csv module to parse stdout..." );
        csv().from.string(stdout, {comment: '#'}).to.array( function(data) {
          var colonyJSON = json_from_csv(data);
          console.log(JSON.stringify(colonyJSON));
          callback(colonyJSON);
        });
      }
    }));

  } else {
    console.log("server/opencfu.js: settings.opencfu is " + Meteor.settings.opencfuPath
              + "\n\tusing dummy " + Meteor.settings.fakeColonyData);
    callback(JSON.parse(Assets.getText(Meteor.settings.fakeColonyData)));
  }

}


// takes a csv object
// returns array of JSON objects containing row elements
var json_from_csv = function(csv_object) {
  var return_array = [];
  // grab header row (assumes first entry is the header)
  var header = csv_object.shift();
  // build object from each row
  csv_object.forEach(function(row) {
    var row_obj = {};
    for (var i=0; i< row.length; i++){
      // header items as keys, row items as values
      row_obj[header[i]] = parseFloat(row[i]);
    };
    return_array.push(row_obj);
  });
  return return_array;
}
