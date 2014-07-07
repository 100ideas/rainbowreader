var request = Npm.require('request');
var fs = Npm.require('fs');

var serverAddress = 'http://localhost:3000';

function postColonyData(dishBarcode, jsonFilename, imageFilename) {
  postDishJson(dishBarcode, jsonFilename);
  postDishImage(dishBarcode, imageFilename);
}
 
var postDishJson = function(dishBarcode, jsonFilename) {  
  var colonyOptions = {
    url: serverAddress + '/uploadColonyData',
    headers: { barcode: dishBarcode }
  };

  //create a post request, and if it fails, push a function onto a list to retry later
  var req = request.post(colonyOptions, function(error, resp, body) {
    console.log('postDishJson response:\n' + body);
    if(error) {
      postsToRetry.push(function() {
        postDishJson(dishBarcode, jsonFilename);
      });
    }
  });

  //send the file through the request
  fs.createReadStream(jsonFilename).pipe(req);
}

var filenameFromPath = function(path) {
  return path.substring(1+path.lastIndexOf('/'));
}

var postDishImage = function(dishBarcode, imageFilename) {
  console.log('postDishImage called');
  var imageOptions = {
    url: serverAddress + '/uploadDishImage',
    headers: { barcode: dishBarcode, filename: filenameFromPath(imageFilename) }
  };

  //create a post request, and if it fails, push a function onto a list to retry later
  var req = request.post(imageOptions, function(error, resp, body) {
    console.log('postDishImage resp:\n ' + resp);
    if(error) {
      postsToRetry.push(function () {
        postDishImage(dishBarcode, imageFilename);
      });
    }
  });

  //send the file through the request
 fs.createReadStream(imageFilename).pipe(req);
}

var testUpload = function() {
  var imageFilename = '/home/administrator/dev/rainbow-reader/public/small.jpg';
  var jsonFilename =  '/home/administrator/dev/rainbow-reader/test/small.json';
  postColonyData('abcde', jsonFilename, imageFilename);
}

