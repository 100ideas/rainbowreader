/*
Runs OpenCFU and asynchronously returns an array of JSON objects.

GLOBAL FUNCTIONS
++++++++++++++++
  runOpenCFU(filename, callback)
    runs OpenCFU on local image file
    callback takes a single JSON array
*/

var exec = Meteor.require('child_process').exec;
var csv = Meteor.require('csv');

// TODO wrap lines in debug
var fs = Meteor.require('fs');
// in case exec fails, JSON containing results of sample calculation
var backupFilePath = '/code/rainbowreader/test/colonyData.json';


// runs OpenCFU on local image file
// callback is passed single JSON array
runOpenCFU = function(filename, callback) {
  // looks for OpenCFU executable here
  var opencfuPath = "/home/administrator/dev/opencfu/opencfu";
  // run OpenCFU with parameters
  // TODO explain parameters
  var cmd = opencfuPath + " -d bil -t 3 -i " + filename;

  // run opencfu and save output
  // TODO change exec to spawn, because exec has limited output buffer
  var child = exec(cmd, Meteor.bindEnvironment(function (error, stdout, stderr) {
    if (error || stderr) {
      console.log("shit went down in the OpenCFU...");
      if (error) console.log("error: " + error);
      if (stderr) console.log("stderr: " + stderr);
      // TODO use dummy data for now (wrap in debug)
      var colonyData = fs.readFileSync(backupFilePath).toString();
      callback(JSON.parse(colonyData));
    }
    // success. parse stdout with csv module and return JSON to callback
    else {
      csv().from.string(stdout, {comment: '#'}).to.array( function(data) {
        var colonyJSON = json_from_csv(data);
        callback(colonyJSON);
      });
    }
  }));
}


// takes a csv object
// returns array of JSON objects containing row elements
var json_from_csv = function(csv_object) {
  var return_array = [];
  // grab header row (assumes first entry is the header)
  var header = csv_object.shift();
  // build object from each row
  Array.prototype.forEach(csv_object, function(row) {
    var row_obj = {};
    for (var i=0; i< row.length; i++){
      // header items as keys, row items as values
      row_obj[header[i]] = parseFloat(row[i]);
    };
    return_array.push(row_obj);
  });
  return return_array;
}
