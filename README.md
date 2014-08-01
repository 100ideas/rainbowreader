#Rainbow Reader

Rainbow Reader is software that photographs and analyzes petri dishes containing visible bacterial colonies.  It is powered by Meteor and Node.js, supplying a user interface in web browser.  It connects by USB to a Motorola DS457 barcode scanner and gphoto-compatible camera.

##TODO list

Linux:
- reliable device file name for scanner
- permissions for scanner
- driver for scanner

Web:
- clear up funkiness of collection entry as workstationSession
- how does reading station know address of visualization server?

Deployment:
- see server/lib/settings.js to set environment-specific options
- need to refactor paths in code into Meteor.settings.pathName
- using absolute paths, it's ugly
  - but getting help from *process.env* [environment variables](http://www.meteorpedia.com/read/Environment_Variables) like PWD

Requirements:
- gphoto2 (and init script for Canon EOS Rebel?)
- barcode scanner
- opencfu no-gui

Debug: 
- set the associated filepath to *false* in "settings.js to disable opencfu, barcode scanner, and gphoto calls
- check out [server-eval meteorite package](http://stackoverflow.com/questions/11034941/meteor-debug-on-server-side) and [crx chrome extension](https://github.com/gandev/meteor-server-console/releases) for accessing the server console