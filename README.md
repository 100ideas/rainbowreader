#Rainbow Reader

Rainbow Reader is a [meteor](http://meteor.com) application that photographs and analyzes petri dishes containing visible bacterial colonies using [OpenCFU](https://github.com/qgeissmann/OpenCFU), [gphoto2](http://gphoto.org/), and an optional barcode scanner for sample tracking.

It is powered by Meteor and Node.js, supplying a user interface in web browser.  It connects by USB to a Motorola DS457 barcode scanner and gphoto2-compatible camera. It also optionally sends data to [ecolor](https://github.com/intron/ecolor), a sister meteor app that presents live visualizations of the aggregated measurements.

Both apps were developed for the "e.Pixels" prototype biotech exhibit at [The Tech Museum of Innovation](http://www.thetech.org/) in San Jose.

![](https://github.com/100ideas/rainbowreader/raw/master/public/images/PROJECT_SoftwareDetails3_-_RR_screenshot1.png)

Participants at the exhibit transform lab bacteria with a pool of ~900 different plasmids, each containing a red, green, and blueish reporter under individual control of a randomly selected promoter-rbs from a set of 9 spanning ~2.5 orders of expression power. Each of the 900 plasmids should theoretically drive a unique expression ratio of the three reporter genes, causing each colony to appear with a unique hue, similar to the operation of an RGB LED. Which combinations will fail? Which colors won't we see? This software and the participation of visitors at the Tech Museum is designed to find that out.

More information about the biological side of this project will be available at http://2014.igem.org/Team:The_Tech_Museum after Oct 30 2014.

## Requirements:
- [meteor.js](http://meteor.com)
- barcode scanner, we used [Motorola DS457](http://www.motorolasolutions.com/US-EN/Business+Product+and+Services/Bar+Code+Scanning/Fixed+Mount+Scanners/DS457_US-EN) [vendor software](https://portal.motorolasolutions.com/Support/US-EN/Resolution?solutionId=5265&productDetailGUID=210e4a4651a30410VgnVCM10000081c7b10aRCRD&detailChannelGUID=e5576e203763e310VgnVCM1000000389bd0aRCRD) (currently only working in linux)
- gphoto2 [homebrew](https://github.com/Homebrew/homebrew/blob/master/Library/Formula/gphoto2.rb)
- gphoto2-compatible camera, we used a Canon Eos Rebel T3 AKA 1100d, [~$500 new w/ kit](http://www.amazon.com/Canon-Rebel-Digital-18-55mm-Movie/dp/B004J3Y9U6/) + [AC power adaptor](http://www.amazon.com/Kapaxen-ACK-E10-Adapter-Digital-Camera/dp/B0057J3ZQK)
- opencfu no-gui [homebrew](https://github.com/qgeissmann/homebrew-gtkquartz/blob/master/opencfu.rb)

## Usage
- install requirements, buy camera & usb scanner
- clone repo
- update `server/lib/settings.js` to disable opencfu, barcode scanner, and gphoto calls as needed
- create a writable folder to store photos to, and set this location in `server/lib/settings.js`
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

## Architecture (in progress)
Rainbow Reader stores photos locally to disk in a location set in the server settings file.  A meteor hook hosts the contents of this folder at the URL /photos.
