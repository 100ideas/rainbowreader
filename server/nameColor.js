// global 'exported' functions
// - getNameForColor

var fs = Meteor.require('fs');
var readline = Meteor.require('readline');

var colorsFilename = 'rgb.txt';

/////////////////////////////////////////////////////////////////////////////////
// tests

function testFindingColors() {
  //testFindingColor([75,231,198], 2);
  //testFindingColor([59,233,184], 2);
  //testFindingColor([46,210,37], 2);
  for (var i = 0; i < 10; i++) testFindingRandomColor();
}

function testFindingColor(rgb, offset) {
  console.log(rgb + ' is closest to ' + JSON.stringify(findClosestColorUsingSectors(rgb, offset)));
}

function testFindingRandomColor() {
  function r() { return Math.floor(Math.random() * 255); }
  testFindingColor([r(), r(), r()]);
}

////////////////////////////////////////////////////////////////////////////////
// helpers

// takes a string of 6 hex chars and returns a 3-element array
function toRGB(hexstr) {
  var num = parseInt(hexstr, 16);
  return [num >> 16, num >> 8 & 255, num & 255];
}

// returns the square of the euclidean distance between 2 vectors
// square root is monotonic, so you can compare distances without taking the square root
function sqdistance(array1, array2) {
  if (array1.length > array2.length) return 0;
  
  var sum = 0;
  for (var i = 0; i < array1.length; i++) {
    var d = array1[i] - array2[i];
    sum = sum + d*d;
  }

  return sum;
}

function indicesFromRGB(rgb) {
  return rgb.map(function(val) { return Math.floor(val/sectorSpan); });
}

function getSectorFromIndices(indices) {
  return colorSpace[indices[0]][indices[1]][indices[2]];
}

/////////////////////////////////////////////////////////////
// data structures and startup code

var colors = [];  // list of all colors with names and RGB triples
var numSectors = 8;  // how many pieces to divide each dimension of the space into
var sectorSpan = Math.ceil(256 / numSectors); // we divide by this to index into an array, so ceil must be used if this division does not produce an integer, otherwise we could index past the array bounds
var colorSpace = new Array(numSectors);  // 3-dim spatial hash map where each entry is an array of color objects

function constructColorSpace() {
  // construct 3-dimensional array of arrays
  for (var i = 0; i < numSectors; i++) {
    colorSpace[i] = new Array(numSectors);
    for (var j = 0; j < numSectors; j++) {
      colorSpace[i][j] = new Array(numSectors);
      for (var k = 0; k < numSectors; k++) {
        colorSpace[i][j][k] = new Array();    // array that will hold colors in this sector
      }
    }
  }

  // spatially hash each color into the sector which contains it
  colors.forEach(function(color) {
    var indices = indicesFromRGB(color.rgb);
    var sector = getSectorFromIndices(indices);
    sector.push(color);
  });

  console.log('Done reading ' + colors.length + ' colors.');
  //console.log(colorSpace[numSectors-1][0][0]);
  //testFindingColors();
}


// read color names and RGB values from file
var lines = Assets.getText(colorsFilename).split('\n');
lines.forEach(function(line) {
  if (line) { 
    var tokens = line.split('\t');
    var rgbstr = tokens[1].replace('#', '');
    var rgb = toRGB(rgbstr);
    colors.push({rgb:rgb, name:tokens[0]});
  }
});

constructColorSpace();

////////////////////////////////////////////////////////////////////////
// search functions

function findClosestColorUsingSectors(rgb, offset) {

  // default to search 1 sector away from the sector that would contain rgb
  if (typeof offset === 'undefined') { offset = 1; }

  // locate the color in our spacial hash map
  var indices = indicesFromRGB(rgb);
  var minIndices = indices.map(function(i) { return Math.max(i - offset, 0); });
  var maxIndices = indices.map(function(i) { return Math.min(i + offset, numSectors-1); });

  var closestEntry = null;
  var closestDistance = 3*256*256; // larger than larger possible distance between 2 colors
  var colorsTested = 0;
  //console.log('printing sectors visited:');

  // search the sector and the 8 sectors surrounding it
  for(x = minIndices[0]; x <= maxIndices[0]; x++) {
    for(y = minIndices[1]; y <= maxIndices[1]; y++) {
      for(z = minIndices[2]; z <= maxIndices[2]; z++) {
        //console.log('' + [x,y,z]);
        getSectorFromIndices([x,y,z]).forEach(function(colorEntry) {
          // calculate and compare distance with best candidate found so far
          colorsTested++;
          var sqdist = sqdistance(rgb, colorEntry.rgb);
          if (sqdist < closestDistance) {
            closestDistance = sqdist;
            closestEntry = colorEntry;
          }
        });
      }
    }
  }

  //console.log('colors tested: ' + colorsTested);

  // TODO: test that rgb is closer to the found color than to the edge of the sectors searched
  // If not, then expand the search space, or search the whole list

  if (closestEntry == null) {
    return { rgb:[0,0,0], name:'NO COLOR NAME' };
  }

  return closestEntry;
}


// rgb is an array of 3 numbers between 0 and 255
// returns an object with name and rgb properties
function findClosestColor(rgb, arrayOfColors) {
  var closestEntry = null;
  var closestDistance = 3*256*256; // larger than distance between black and white squared

  arrayOfColors.forEach(function(c) {
    var sqdist = sqdistance(rgb, c.rgb);
    if (sqdist < closestDistance) {
      closestDistance = sqdist;
      closestEntry = c;
    }
  });

  console.log('' + rgb + ' is closest to ' + closestEntry.rgb + ' named ' + closestEntry.name);
  return closestEntry;
}

// EXPORTED!
// Takes an RGB triple and returns a string.
// rgb is an array of 3 numbers between 0 and 255
getNameForColor = function(rgb) {
  var colorEntry = findClosestColorUsingSectors(rgb);
  if (colorEntry && colorEntry.name) return colorEntry.name;
  return "NO COLOR NAME";
}


