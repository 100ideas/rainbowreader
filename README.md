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
- need list of expected environment paths 
  - photo storage
  - barcode scanner fallback
  - camera fallback
- need fallback options in case of missing software / hardware
  - barcode scanner fallback
  - camera fallback
  - opencfu missing

Requirements:
- gphoto2 (and init script for Canon EOS Rebel?)
- barcode scanner
- opencfu no-gui
