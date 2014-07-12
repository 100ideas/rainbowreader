//// TODO replace global functions with require-like functionality
////
//// hitlist:
//// takePhoto
//// runOpenCFU
//// postColonyData

// Holds the id of the mongo document which holds the state between server and client.
// Is a string once the server creates the document, but Templates will not react at
// all if it is '' or undefined
workstationSession = {};

if (Meteor.isClient) {
  // get the state document id from the server
  Meteor.call('createWorkstationSession', function(error, result) {
     workstationSession = result;




    // create some phony ass barcodes
    debugEnterBarcodes();

    // phony ass photo taking event man
    Meteor.call('takeAndAnalyzePhoto', getSessionDocument().dishBarcode);





    // watch the record for changes; animate when colonyData 
    WorkstationSessions.find(workstationSession).observeChanges({
      changed: function(id, fields) {
        if (fields.colonyData) {
          // if we have colonyData, we're ready to animate
          animatePetriDish();
        } 
      }  
    })
  });

  // Helper for retrieving state.  There should only be one.
  function getSessionDocument() {
    return WorkstationSessions.findOne(workstationSession);
  }
  
  ///////////////////////////////////////////////////////////////////////////////
  // STATE MACHINE / WORKFLOW template functions
  // These are evaluated by the html to see what we should be showing when.
  // Probably only one should evaluate to true at a time.

  // starting state, so return true by default
  Template.hello.showScanBarcodes = function () {
    var doc = getSessionDocument();
    if (!doc) return true;
    return !doc.dishBarcode || !doc.userBarcode;
  }

  // once we have scanned both barcodes, show instructions for taking photograph
  Template.hello.showTakePhoto = function () {
    var doc = getSessionDocument();
    if (!doc) return false;
    return doc.userBarcode && doc.dishBarcode && !doc.photoURL;
  }

  // show the image and colony animations
  Template.hello.showDishPhoto = function () {
    var doc = getSessionDocument();
    if (!doc || !doc.photoURL) return false;
    return doc.photoURL;
  };


  // ALL THE D3S
  function animatePetriDish() {
    var svg = d3.select('#viz')
      .append('svg')

    var colonySelector = svg.selectAll('circle')
      .data(WorkstationSessions.findOne(workstationSession).colonyData)
      .enter()
    drawReticle(colonySelector);
  }





// HELPER FUNCTION

function drawReticle(selector) {
  var reticleWidth = '2px';
  var reticleSize = 1.7;
  var reticleInside = 0.6 * reticleSize;
  var reticleOutside = 1.5 * reticleSize
  selector
    .append('circle')
    .attr('r', function(d) {return (d.Radius * reticleSize)})
    .attr('cx', function(d) {return d.X}) 
    .attr('cy', function(d) {return d.Y})
    .style('fill', 'none')
    .style('stroke', 'cyan')
    .style('stroke-width', reticleWidth);
  selector
    .append("line")
    .attr("x1", function(d) {return d.X})
    .attr("y1", function(d) {return d.Y - d.Radius * reticleInside})
    .attr("x2", function(d) {return d.X})
    .attr("y2", function(d) {return d.Y - d.Radius * reticleOutside})
    .style('stroke', 'cyan')
    .style('stroke-width', reticleWidth);
  selector
    .append("line")
    .attr("x1", function(d) {return d.X + d.Radius * reticleInside})
    .attr("y1", function(d) {return d.Y})
    .attr("x2", function(d) {return d.X + d.Radius * reticleOutside})
    .attr("y2", function(d) {return d.Y})
    .style('stroke', 'cyan')
    .style('stroke-width', reticleWidth);
  selector
    .append("line")
    .attr("x1", function(d) {return d.X})
    .attr("y1", function(d) {return d.Y + d.Radius * reticleInside})
    .attr("x2", function(d) {return d.X})
    .attr("y2", function(d) {return d.Y + d.Radius * reticleOutside})
    .style('stroke', 'cyan')
    .style('stroke-width', reticleWidth);
  selector
    .append("line")
    .attr("x1", function(d) {return d.X - d.Radius * reticleInside})
    .attr("y1", function(d) {return d.Y})
    .attr("x2", function(d) {return d.X - d.Radius * reticleOutside})
    .attr("y2", function(d) {return d.Y})
    .style('stroke', 'cyan')
    .style('stroke-width', reticleWidth);
}





  ///////////////////////////////////////////////////////////////////////////////
  // EVENT HANDLERS

  Template.hello.events({
    // TODO how is this function hooked up to the Take Photo button?
    // take a photograph and analyze it on the server;
    // we will receive colonyData through {{colonyData}} handlebars
    'click input': function () {
      Meteor.call('takeAndAnalyzePhoto', getSessionDocument().dishBarcode);
    }
  });
}

// DEBUG: for inputting barcodes without a scanner
debugEnterBarcodes = function() {
  var b = Date.now();
  WorkstationSessions.update(workstationSession, {$set: {userBarcode: b, dishBarcode: b}});
}

// takes barcode and determines whether it's dishBarcode or userBarcode
function determineBarcodeType(barcode) {
  if (barcode[0] == 'D') return 'dishBarcode';
  return 'userBarcode';
}

if (Meteor.isServer) {
  // code to run on server at startup
  Meteor.startup(function () {

    // initialize barcode scanner
    // and write barcodes to workstationSession
    listenForBarcodes(function(barcode) {
      // ignore barcodes if there isn't a browser session
      // otherwise write to workstationSession
      // WARNING: workstationSession is {} if not browser session
      // because Meteor weirdness.
      console.log('workstationSession: ' + workstationSession);
      //if (Object.keys(workstationSession).length !== 0) {
      if (typeof workstationSession === 'string') {
        try { 
          // choose the property name based on the type of barcode
          var name = determineBarcodeType(barcode);
          var field = {};
          field[name] = barcode;
          WorkstationSessions.update(workstationSession, {$set: field});
        }
        catch(ex) {
          console.log('exception updating workstationSession: ' + ex);
        }
      }
    });
  });

  Meteor.methods({
    createWorkstationSession: function() {
      // create a single mongo document to hold state between server and client
      console.log('create session');
      WorkstationSessions.remove({});   //clear previous session documents
      workstationSession = WorkstationSessions.insert({dateCreated: Date.now()});
      return workstationSession;
    },
    
    takeAndAnalyzePhoto: function(dishBarcode) {
      takePhoto(dishBarcode, Meteor.bindEnvironment(function(photoPath) {

        // convert '~/rainbowreader/public/photos/photo1.jpg'
        // to 'photos/photo1.jpg'
        var ixPhotos = photoPath.indexOf('photos/');
        if (ixPhotos === -1) {
          console.log('error parsing photo path into URL: ' + photoPath);
          return;
        }
        var photoURL = photoPath.slice(ixPhotos);

        WorkstationSessions.update(
          {dishBarcode: dishBarcode},
          {$set: {photoURL: photoURL}}
        );

        runOpenCFU(photoPath, Meteor.bindEnvironment(function(colonyData) {
          WorkstationSessions.update(
            {dishBarcode: dishBarcode},
            {$set: {colonyData: colonyData}}
          );

          // uploads relevant data to the main visualization server
          //postColonyData(dishBarcode, colonyData, photoPath);
        }));
      }));
    }
  });
}
