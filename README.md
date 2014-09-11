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

## General Meteor tips
- [Project file structure suggested in meteor faq](https://github.com/oortcloud/unofficial-meteor-faq#where-should-i-put-my-files)
```bash
lib/                       # <- any common code for client/server.
lib/environment.js         # <- general configuration
lib/methods.js             # <- Meteor.method definitions
lib/external               # <- common code from someone else
## Note that js files in lib folders are loaded before other js files.

collections/               # <- definitions of collections and methods on them (could be models/)

client/lib                 # <- client specific libraries (also loaded first)
client/lib/environment.js  # <- configuration of any client side packages
client/lib/helpers         # <- any helpers (handlebars or otherwise) that are used often in view files

client/application.js      # <- subscriptions, basic Meteor.startup code.
client/index.html          # <- toplevel html
client/index.js            # <- and its JS
client/views/<page>.html   # <- the templates specific to a single page
client/views/<page>.js     # <- and the JS to hook it up
client/views/<type>/       # <- if you find you have a lot of views of the same object type
client/stylesheets/        # <- css / styl / less files

server/publications.js     # <- Meteor.publish definitions
server/lib/environment.js  # <- configuration of server side packages

public/                    # <- static files, such as images, that are served directly.

tests/                     # <- unit test files (won't be loaded on client or server)
```
