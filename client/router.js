// template functions for determining what state we're in
// see main.js in root for states

// returns the current state as a string
Template.plate.uiGetState = function() {
    return uiGetState();
}

// move to next state; you may want to check that you're in a specific state before calling this
Template.plate.uiAdvanceState = function() {
    return uiAdvanceState();
}

/*
///////////////////////////////////////////////////////////////////////////////
// STATE MACHINE / WORKFLOW template functions
// These are evaluated by the html to see what we should be showing when.
// Probably only one should evaluate to true at a time.

// starting state, so return true by default

Session.set("helloButtonClicked",false);
Session.set("introductionButtonClicked",false);
Session.set("instructionsButtonClicked",false);
Session.set("analysisButtonClicked",false);
Session.set("rareColorsButtonClicked",false);


Template.plate.showPlateHello = function () {
  var doc = getSessionDocument();
  //if (Session.get("helloButtonClicked")) return false;
  if (!doc) return true;
  if (doc.hasOwnProperty("userBarcode")) { // for the future when we have plateBarcode && doc.hasOwnProperty("plateBarcode")){
    return !doc.userBarcode; // in the future: !doc.plateBarcode || !doc.userBarcode
  } else {
    return true;
  }
}

Template.plate.showPlateIntroduction = function() {
  var doc = getSessionDocument();
  if (Session.get("introductionButtonClicked")) return false;
  else return doc ? doc.hasOwnProperty("userBarcode") ? doc.userBarcode : false : false;  // wacky double ternary 
}

// once we have scanned both barcodes, show instructions for taking photograph
Template.plate.showPlateInstructions = function () {
  var doc = getSessionDocument();
  if (!doc) return false;

  // old routing logic mac used when developing router code. (commit b702a93)
  // else if (doc && doc.hasOwnProperty("userBarcode"))
  //   return doc.userBarcode && doc.plateBarcode && !doc.photoURL;

  if (Session.get("instructionsButtonClicked")) return false;
  else if (doc && Session.get("introductionButtonClicked") && (doc.hasOwnProperty("userBarcode") || doc.hasOwnProperty("plateBarcode")))
  // return doc.userBarcode && doc.plateBarcode && !doc.photoURL;
    return 1;
  else return 0;
}

// show the image and colony animations
Template.plate.showPlatePhoto = function () {
  var doc = getSessionDocument();

  if (Session.get("analysisButtonClicked")) return false;
  if (doc && doc.photoURL) {
    return doc.photoURL;
  }
  return false;
};

// only show if openCFU is done
// controls transclusion of plateAnalysis in platePhoto
Template.platePhoto.showPlateAnalysis = function () {
  var doc = getSessionDocument();
  if (!doc) return false;
  if (Session.get("analysisButtonClicked")) return false;
  return !!doc.colonyData && Session.get("reticulesDone")
}

// only show if we have some rare colors.
// TODO only trigger after reticule animation is done
Template.plate.showPlateRareColors = function () {
  var doc = getSessionDocument();
  if (Session.get("rareColorsButtonClicked")) return false;
  if (!doc) return false;
  if (!doc.hasOwnProperty('colonyData')) // not always present
    return false
  else
    return Session.get("analysisButtonClicked") && doc.colonyData[0].ColorName;
}

Template.plate.showPlateWallUpdate = function () {
  //var timer = Date.now();
  var doc = getSessionDocument();
  if (!doc) return false;
  //return timer - doc.dateCreated > 1000; // check to see if colorname is set
  return (Session.get("rareColorsButtonClicked"));
}
*/
