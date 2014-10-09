#Rainbow Reader

Rainbow Reader is software that photographs and analyzes petri dishes containing visible bacterial colonies using the open-source colony counting software [OpenCFU](https://github.com/qgeissmann/OpenCFU). It is powered by Meteor and Node.js, supplying a user interface in web browser.  It connects by USB to a Motorola DS457 barcode scanner and gphoto2-compatible camera. It also optionally sends data to [ecolor](https://github.com/intron/ecolor), a sister meteor app that presents live visualizations of the aggregated measurements.

Both apps were developed for a prototype biotech exhibit at [The Tech Museum of Innovation](http://www.thetech.org/) in San Jose.

Participants at the exhibit transform lab bacteria with a pool of ~900 different plasmids, each containing a red, green, and blueish reporter under individual control of a randomly selected promoter-rbs from a set of 9 spanning ~2.5 orders of expression power. Each of the 900 plasmids should theoretically drive a unique expression ratio of the three reporter genes, causing each colony to appear with a unique hue, similar to the operation of an RGB LED. Which combinations will fail? Which colors won't we see? This software and the participation of visitors at the Tech Museum is designed to find that out.

More information about the biological side of this project will be available at http://2014.igem.org/Team:The_Tech_Museum after Oct 30 2014.

## Requirements:
- meteor
- gphoto2
- barcode scanner (currently only working in linux)
- opencfu no-gui


## Usage
- install requirements, buy camera & usb scanner
- clone repo
- update `server/lib/settings.js` to disable opencfu, barcode scanner, and gphoto calls as needed
- set `$METEOR_ENV` as desired
- start meteor (it will need to be restarted after initializing npm meteor package)
- read [the instruction manual](https://github.com/intron/rainbowreader/blob/master/RainbowReader_Instruction_Manual.txt);

## General Meteor tips
- debugging: check out [server-eval meteorite package](http://stackoverflow.com/questions/11034941/meteor-debug-on-server-side) and [crx chrome extension](https://github.com/gandev/meteor-server-console/releases) for accessing the server console
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
