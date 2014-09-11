analyzeColonies = function (colonyData) {
  // parse colors in workstationSession
  // assignCommonNames: iterate over colonyDate and add to each array item
  // findRarestColor: compare current colonies to all in db and pick rarest
  //                  update colonydata.rarestColorIndex with array indices

  // TODO: retrieve colonyData from db query instead of it being passed in,
  // in case some other process has updated the db before us 
  
  console.log("server/analyzeColones: ");

  // assign each colony a color name
  colonyData.forEach(function(colony, index) {
    var rgb = [colony.Rmean, colony.Gmean, colony.Bmean];
    var name = getNameForColor(rgb);
    colony.ColorName = name;
    //console.log('index ' + index + ' setting: ' + field);
    //var field = '"colonyData.' + index + '.ColorName"';
    //WorkstationSessions.update(workstationSession, {$set: {field: name}});
  });

  // Updating the color on colonyData one at a time triggers observeChanges every time.
  // So insert modified data in one update... (and hope some one else isn't trying to modifying data at the same time).
  WorkstationSessions.update(workstationSession, {$set: {colonyData: colonyData}});
  console.log("\tset color names; last one was: " +  WorkstationSessions.findOne(workstationSession).colonyData.pop().ColorName);
  
  // pick the "rarest" 3 colors among these colonies
  // TODO: make this calculation use all colonies in the last X days
  // Use an object as a map to count how many times each color name appears.
  // Then transfer the counts to an array which we sort.
  // The least common colors will be at the top.
  var numberOfRarestColors = 3;
  
  var colorNamesMap = {};
  colonyData.forEach(function(colony, index) {
    if (colorNamesMap[colony.ColorName] === undefined)
      colorNamesMap[colony.ColorName] = {count:1, colonyDataIndex:index};
    else
      colorNamesMap[colony.ColorName].count++;
  });

  // transfer the map's entries into an array
  var colorNamesArray = [];
  for (var key in colorNamesMap) {
    // make sure we don't get an inherited property
    if (colorNamesMap.hasOwnProperty(key)) {
      colorNamesArray.push(colorNamesMap[key]);
    }
  }

  // sort ascending by count
  colorNamesArray.sort(function(a, b) {
    return a.count - b.count;
  });

  // set the rarest 3 indices as an array in the db
  var rareColorIndices = [];
  var numberToChoose = Math.min(colorNamesArray.length, numberOfRarestColors); 
  for (var i = 0; i < numberToChoose; i < i++) {
    rareColorIndices.push(colorNamesArray[i].colonyDataIndex);
  }

  console.log("\tset rarest colonies: " + rareColorIndices)
  
  var set = {$set: {rareColorIndices:rareColorIndices}};
  WorkstationSessions.update(workstationSession, set);

  // TODO: calculate 'rarity' score and how many times this color has been seen before
}