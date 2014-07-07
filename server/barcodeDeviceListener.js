var fs = Npm.require('fs');

var scannerPath = '/dev/hidraw3'
//var ack = new Buffer('010200000400', 'hex');  //doesn't work...maybe default driver doesn't take writes

fs.open(scannerPath, 'r', function(err, fd) {
  if(err) throw err;

  var bufferSize = 64;
  var buffer = Buffer(bufferSize);

  function startRead() {
    fs.read(fd, buffer, 0, bufferSize, null, function(err, bytesRead) {
      if(err) throw err;
      //console.log('bytesRead: ' + bytesRead);

      try { 
        var barcode = readBarcodeSNAPI(buffer);
      } catch(ex) {
        console.log('exception reading barcode: ' + ex);
        startRead();
      }

      console.log(barcode); 
      startRead();  
    });
  }
  startRead();
});
  
  
//
// helper functions
//

function readBarcodeSNAPI(buffer) {
  // Barcode size is at bytes 2-3, big-endian (lower byte definitely at 3;
  // byte 2 may be unrelated but always seems to be zero).
  var barcodeLength = buffer.slice(2).readInt16BE();
  var barcode = buffer.toString('utf8', 6, 6+barcodeLength);
  return barcode;
}


//
// only used in HID keyboard mode
//

/*
var maxBarcodeChars = 20;
var bufferSize = 16 * maxBarcodeChars;

function decodeBarcodeKeyboardEmulation(buffer) {
  
}

function decodeHID(type, c) {
  if(c !== 0) {
    if(type === 0) { //number
      if(c == 39) c -= 10;  //0 comes after 9 in this encoding
      return String.fromCharCode(c - 29 + 48);
    } else if(type === 2) { //capital letter
      return String.fromCharCode(c - 4 + 65);
    } else {
      return '';//console.log('unknown character');
    }
  }
  return '';
}


 
function startRead() {
    // read from the device "file"
    fs.read(fd, buffer, 0, bufferSize, null, function(error, bytesRead) {

      if(error) throw error;
      console.log('bytesRead: ' + bytesRead);

      // barcode starts at byte 6
      console.log(buffer[6]);
      for(var i = 6; i < bytesRead; i++) console.log(buffer[i]);
      var i = 0; 
      var type = buffer[i];
      var c = buffer[i+2];
      barcode += decodeHID(type, c);
      if(barcode.length >= maxBarcodeChars) {
        console.log('barcode: ' + barcode);
        barcode = '';
      }
      startRead();  //node.js supports tail recursion
    });
  }
  startRead();
});
*/