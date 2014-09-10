// we should be using events to do this, not checking for the presence of data... somehow

// show the image and colony animations
Template.plate.showPlatePhoto = function () {
  var doc = getSessionDocument();
  if (!doc || !doc.photoURL) return false;
  return doc.photoURL;
};

// only show if openCFU is done
Template.plate.showPlateAnalysis = function () {
  var doc = getSessionDocument();
  if (!doc) return false;
  console.log("from showPlateAnalysis");
  // console.log(doc);
  return !!doc.colonyData // casts to bool
}

// only show if we have some rare colors.
// TODO only trigger after reticule animation is done
Template.plate.showPlateRareColors = function () {
  var doc = getSessionDocument();
  //var colData = doc.hasOwnProperty('_id');
  // console.log("plate.js: getSessionDocument():" + doc );
  // console.log("\tgetSessionDocument()._id:" + doc._id);
  // console.log("\tgetSessionDocument() keys:");

  //   for (var key in doc) {
  //     if (doc.hasOwnProperty(key)) {
  //       console.log("\t\t" + key);
  //     }
  //   }

  // console.log("\tgetSessionDocument()._id:" + doc._id);
  // console.log("\tgetSessionDocument().colonyData:" + doc.hasOwnProperty('colonyData'));

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

Template.plate.created = function () {
  console.log("plate.js template created... ");
}

Template.plate.renderd = function () {
  console.log("plate.js: Template.plate.rendered finished... callback executed...")
  this.autorun( function (){
    console.log("plate.js: Template.plate autorun function executed...");
    drawCirclesOnPlatePhoto();
    animateReticulesOnPlatePhoto();
  });
}

