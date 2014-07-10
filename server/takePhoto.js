/*
Runs gphoto2 and asynchronously returns path to saved photo.

GLOBAL FUNCTIONS
++++++++++++++++
  takePhoto(dishBarcode, callback)
    run gphoto2 and save photo to disk
    create filename with timestamp and dishBarcode
    callback takes filename of saved photo
*/
var exec = Meteor.require('child_process').exec;

// in case exec fails, sample picture of petri dish
var backupFilePath = '/code/rainbowreader/public/photos/small.jpg';

// run gphoto2 and save photo to disk
// create filename with timestamp and dishBarcode
// callback takes filename of saved photo
takePhoto = function(dishBarcode, callback) {
  // TODO get path properly 
  var photosPath = "./public/photos/";
  var filename = photosPath + Date.now().toString() + '_' + dishBarcode + '.jpg';
  var cmdline = "gphoto2 --capture-and-download --filename=" + filename;

  // TODO wrap in debug
  console.log("capturing photo with gphoto2...");

  //  
  var child = exec(cmdline, function (error, stdout, stderr) {
    if (error || stderr) {
      console.log("shit went down in the gphoto2...");
      if (error) console.log("error: " + error);
      if (stderr) console.log("stderr: " + stderr);
      // TODO use dummy photo for now (wrap in debug)
      filename = backupFilePath;
    }
    callback(filename);
  });
}

