var request = Meteor.npmRequire('request');
var Stream = Meteor.npmRequire('stream');
var fs = Meteor.npmRequire('fs');

// TODO how do we find out the address of the visualization server?
var serverAddress = 'http://localhost:3000';

postColonyDataAndImage = function(dishBarcode, userBarcode, colonyJSON, imageFilename) {
  postDishJson(dishBarcode, userBarcode, colonyJSON);
  postDishImage(dishBarcode, imageFilename);
}
 
function postDishJson(dishBarcode, userBarcode, colonyJSON) {
  //wrap the colonyData string in a stream
  var colonyDataStream = new Stream();
  colonyDataStream.pipe = function(dest) {
    dest.write(JSON.stringify(colonyJSON));
  }

  var colonyOptions = {
    url: serverAddress + '/uploadColonyData',
    headers: { 
      // http headers are converted to lowercase, hence 'dishbarcode'
      dishbarcode: dishBarcode, 
      userbarcode: userBarcode,
      timestamp: Date.now() }
  };

  //create a post request, and if it fails, push a function onto a list to retry later
  var req = request.post(colonyOptions, function(error, resp, body) {
    if(error) {
      postsToRetry.push(function() {
        postDishJson(dishBarcode, userBarcode, colonyJSON);
      });
    }
  });
  
  //send the data through the request
  colonyDataStream.pipe(req);
  //fs.createReadStream(jsonFilename).pipe(req);
}

function filenameFromPath(path) {
  return path.substring(1+path.lastIndexOf('/'));
}

function postDishImage(dishBarcode, imageFilename) {
  var imageOptions = {
    url: serverAddress + '/uploadDishImage',
    // http headers are converted to lowercase, hence 'dishbarcode'
    headers: { dishbarcode: dishBarcode, filename: filenameFromPath(imageFilename) }
  };

  //create a post request, and if it fails, push a function onto a list to retry later
  var req = request.post(imageOptions, function(error, resp, body) {
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
  var imageFilename = 'public/small.jpg';
  var jsonFilename =  'test/small.json';
  postColonyDataAndImage('abcde', jsonFilename, imageFilename);
}

