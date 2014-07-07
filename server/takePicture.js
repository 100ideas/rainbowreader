var exec = Npm.require('child_process').exec;

function takePicture(dishBarcode) {
  var photosPath = "./photos/";
  var filename = photosPath + Date.now().toString() + '_' + dishBarcode + '.jpg';
  var cmdline = "gphoto2 --capture-and-download --filename=" + filename;

  // run gphoto 
  var child = exec(cmdline, function (error, stdout, stderr) {
    if (error || stderr) {
      console.log("shit went down in the gphoto..." + stderr);
    }
    else {
      return filename;
    }
  });
}

