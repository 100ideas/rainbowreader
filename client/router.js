///////////////////////////////////////////////////////////////////////////////
// STATE MACHINE / WORKFLOW template functions
// These are evaluated by the html to see what we should be showing when.
// Probably only one should evaluate to true at a time.

// starting state, so return true by default
Template.plate.showPlateHello = function () {
  var doc = getSessionDocument();
  if (!doc) return true;
  // return !doc.dishBarcode || !doc.userBarcode;
  return 1;
}

// once we have scanned both barcodes, show instructions for taking photograph
Template.plate.showPlateMeasurementInstruction = function () {
  var doc = getSessionDocument();
  if (!doc) return false;
  // return doc.userBarcode && doc.dishBarcode && !doc.photoURL;
  return 1;
}

// show the image and colony animations
Template.plate.showPlatePhoto = function () {
  var doc = getSessionDocument();
  if (!doc || !doc.photoURL) return false;
  return doc.photoURL;
};

// only show if openCFU is done
// controls transclusion of plateAnalysis in platePhoto
Template.plate.showPlateAnalysis = function () {
  var doc = getSessionDocument();
  if (!doc) return false;
  return !!doc.colonyData // casts to bool
}

// only show if we have some rare colors.
// TODO only trigger after reticule animation is done
Template.plate.showPlateRareColors = function () {
  var doc = getSessionDocument();
  if (!doc) return false;
  if (!doc.hasOwnProperty('colonyData')) // not always present
    return false
  else 
    return doc.colonyData[0].colorName;
}

Template.plate.showPlateWallUpdate = function () {
  var timer = Date.now();
  var doc = getSessionDocument();
  if (!doc) return false;
  return timer - doc.dateCreated > 1000; // check to see if colorname is set
}