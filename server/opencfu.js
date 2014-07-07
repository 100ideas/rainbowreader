var exec = Npm.require('child_process').exec;
var csv = Npm.require('csv');
var _ = Npm.require('lodash');

//assumes first entry is the header, true for opencfu
var csv_to_json = function(csv_data) {
  var header = csv_data.shift();
  var return_array = [];

  Array.prototype.forEach(csv_data, function(row) {
    var row_obj = {};
    for (var i=0; i< row.length; i++){
      row_obj[header[i]] = parseFloat(row[i]);
    };
    return_array.push(row_obj);
  });

  return return_array;
}



// run opencfu as separate process on the image (already exists on this machine)
function runOpenCFU(filename) {

  //var filename = "/home/administrator/dev/rainbow-reader/public/small.jpg";
  var opencfuPath = "/home/administrator/dev/opencfu/opencfu";
  var cmd = opencfuPath + " -d bil -t 3 -i " + filename;

  // run opencfu and save output
  // TODO change exec to spawn, because exec has limited output buffer
  var child = exec(cmd, function (error, stdout, stderr) {
    if (error || stderr) {
      console.log("shit went down..." + stderr );
    }
    else {
      csv().from.string(stdout, {comment: '#'}).to.array( function(data) {
        var ocfu_calls = csv_to_json(data);
        return JSON.stringify(ocfu_calls);
      });
    }
  });
}
