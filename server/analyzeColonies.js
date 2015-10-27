analyzeColonies = function (colonyData) {
  // parse colors in workstationSession
  // assignCommonNames: iterate over colonyDate and add to each array item
  // findRarestColor: compare current colonies to all in db and pick rarest
  //                  update colonydata.rarestColorIndex with array indices

  // TODO: perhaps retrieve colonyData from db query instead of it being passed in,
  // in case some other process has updated the db before us

  console.log("server/analyzeColones: ");
  var lastColorName = "null";

  // assign each colony a color name
  colonyData.forEach(function(colony, index) {
    var rgb = [colony.Rmean, colony.Gmean, colony.Bmean];
    var name = getNameForColor(rgb);
    colony.ColorName = name;
    lastColorName = name;
    //console.log('index ' + index + ' setting: ' + field);
    //var field = '"colonyData.' + index + '.ColorName"';
    //WorkstationSessions.update(workstationSession, {$set: {field: name}});
  });

  console.log("\tset color names; last one was: " + lastColorName);
  calculateColorRarity(colonyData);

  // Updating the color on colonyData one at a time triggers observeChanges every time.
  // So insert modified data in one update... (and hope some one else isn't trying to modifying data at the same time).
  WorkstationSessions.update(workstationSession, {$set: {colonyData: colonyData}});
  console.log('\tupdated db with colony data');
}

// This function takes and modifies an array of colonyData.
// It calculates a rarity score based on the color of each colony.
// It also finds the 3 rarest colors and store the indices of a colony of each color.
// We modify the colonyData, because the function that calls this one then updates colonyData
// in the database.
function calculateColorRarity(colonyData) {
  // pick the "rarest" 3 colors among these colonies
  // TODO: make this calculation use all colonies in the last X days
  // Use an object as a map to count how many times each color name appears.
  // Then transfer the counts to an array which we sort.
  // The least common colors will be at the top.
  var numberOfRarestColors = 3;

  // get the number of colonies
  var countAllColonies = colonyData.length;
  var stats = Visualizations.findOne({'id': 'stats'});
  if (stats && stats.coloniesCount) countAllColonies += stats.coloniesCount;

  // retrieve counts for colors of previous colonies and add colonyData
  var colorNamesMap = Visualizations.findOne({'id': 'colorCounts'}) || {};
  colonyData.forEach(function(colony, index) {
    if (colorNamesMap[colony.ColorName] === undefined)
      colorNamesMap[colony.ColorName] = 1;
    else
      colorNamesMap[colony.ColorName]++;
  });

  // Calculate the fraction of all colonies which are each color.
  // This includes the current colonyData, so each should have a defined count.
  colonyData.forEach(function(colony) {
    var count = colorNamesMap[colony.ColorName];
    colony.NumberOfColoniesThisColor = count;
    colony.Rarity = count / countAllColonies;
  });

  // sort ascending by count
  colonyData.sort(function(a, b) {
    return a.Rarity - b.Rarity;
  });

  // walk through the sorted colonies, and save the indices of max 3 unique colors
  var rareColorIndices = [];
  var numberToChoose = Math.min(colonyData.length, numberOfRarestColors);
  for (var i = 0; rareColorIndices.length < numberToChoose; i++) {
    // have we picked this color already?
    var seenColor = false;
    rareColorIndices.forEach(function(j) {
      if (colonyData[j].ColorName == colonyData[i].ColorName) seenColor = true;
    });
    if (seenColor == false) rareColorIndices.push(i);
  }

  // set the rarest 3 indices as an array in the db; also set the total number of colonies
  var set = {$set: {rareColorIndices:rareColorIndices, coloniesCountAtThisTime:countAllColonies}};
  WorkstationSessions.update(workstationSession, set);
}
