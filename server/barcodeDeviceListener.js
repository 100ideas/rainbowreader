/*
Start listening for barcodes (plateBarcode or userBarcode).
If scanned, save barcode to workstationSession.

GLOBAL FUNCTIONS
++++++++++++++++
 listenForBarcodes(callback)
  listens for barcode from scanner
  calls callback on resulting barcode
*/

// udev rule for assigning a symlink and setting permissions on the Morotola DS457 USB scanner.
// TODO The interface string may depend on the scanner being in SNAPI mode--investigate other modes.
// ACTION=="add", SUBSYSTEM=="hidraw", ATTRS{interface}=="SNAPI Command Interface" MODE="0666" SYMLINK="usbscanner"


var fs = Meteor.npmRequire('fs');

var scannerPath = Meteor.settings.scannerPath;
var barcodeScannerPresent = !!scannerPath; //casting to bool; scannerpath is either *false* or a path (or '' which is falsey)

//var ack = new Buffer('010200000400', 'hex');  //doesn't work...maybe default driver doesn't take writes

// TODO figure out a way to close the scanner device file
listenForBarcodes = function(callback) {
  console.log("server/barcodeDeviceListener.js:");

  if (barcodeScannerPresent) {

    fs.open(scannerPath, 'r', Meteor.bindEnvironment(function(error, fd) {
      if (error) {
        console.log("\tshit went down in barcodeDeviceListener...");
        console.log("\terror: " + error);
      }
      console.log('\tbarcode scanner device file opened');

      var bufferSize = 64;
      var buffer = Buffer(bufferSize);

      function startRead() {
        fs.read(fd, buffer, 0, bufferSize, null, Meteor.bindEnvironment(function(error, bytesRead) {
          if (error) {
            console.log("\tbarcodeDeviceListener: error reading from device");
            console.log("\tbarcodeDeviceListener: error: " + error);
          }

          var barcode = parseBarcodeSNAPI(buffer);
          console.log('\tread from barcode scanned: ' + barcode);

          callback(barcode);
          // fs.read is asynchronous; callback must be recursive to read subsequent buffer
          // this paradigm only makes sense because Node.js supports tail recursion
          startRead();
        }));
      }

      startRead();

    }));

  } else {
    var fakeBarcode = 'BARCODE_SCANNER_MISSING';
    console.log("\tbarcodeScannerPresent?: " + barcodeScannerPresent);
    console.log("\tsetting fake barcodes: \n\t\tuserBarcode: " + fakeBarcode + "\n\t\tplateBarcode: " + fakeBarcode);
    WorkstationSessions.update(workstationSession, {$set: {userBarcode: fakeBarcode, plateBarcode: fakeBarcode}});
  }

  // Experimental code for closing the file
  /*var shouldClose = false;

  return function() {
    shouldClose = true;
    console.log('shouldClose callback called.');
  });*/
}


// converts raw scanner output to ASCII string
function parseBarcodeSNAPI(buffer) {
  try {
    // barcode size is at bytes 2-3; big-endian; lower byte definitely at 3;
    // byte 2 may be unrelated but always seems to be zero).
    var barcodeLength = buffer.readInt16BE(2);
    var barcode = buffer.toString('utf8', 6, 6+barcodeLength);
    return barcode;
  }
  catch(ex) {
    console.log("\texception parsing barcode: " + ex);
  }
}

// DEBUG: for inputting barcodes without a scanner
// debugEnterBarcodes = function() {
//   var b = Date.now();
//   console.log('debug mode: setting fake barcode as current date: ' + b);
//   WorkstationSessions.update(workstationSession, {$set: {userBarcode: b, plateBarcode: b}});

// }




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
    fs.read(fd, buffer, 0, bufferSize, null, function(erroror, bytesRead) {

      if(erroror) throw erroror;
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
