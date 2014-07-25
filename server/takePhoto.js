(function(){/*
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
// not sure best convention for combining working directory of meteor
// and local paths specified in settings.js
var colonyPhotoPath = Meteor.settings.colonyPhotoPath;

// run gphoto2 and save photo to disk
// create filename with timestamp and dishBarcode
// callback takes filename of saved photo
takePhoto = function(dishBarcode, callback) {
  // TODO get path properly 
  // var photosPath = "./public/photos/";
  var photosPath = colonyPhotoPath;
  var filename = photosPath + Date.now().toString() + '_' + dishBarcode + '.jpg';
  var cmdline = "gphoto2 --capture-image-and-download --filename=" + filename;

  // TODO wrap in debug
  console.log("capturing photo with gphoto2...");
  console.log("fakemode: " + Meteor.settings.fakeMode);

  if (!Meteor.settings.fakeMode) {
    var child = exec(cmdline, function (error, stdout, stderr) {
      if (error || stderr) {
        console.log("shit went down in the gphoto2...");
        if (error) console.log("error: " + error);
        if (stderr) console.log("stderr: " + stderr);
        // TODO use dummy photo for now (wrap in debug)
        filename = colonyPhotoPath;
      }
      callback(filename);
    });
  } else {
    console.log("fakemode: skipping gphoto, using " + colonyPhotoPath);
    callback(colonyPhotoPath);
  }
}


})();
