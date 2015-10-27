//////////////////////////////////////////////////////////////////////////////
//// settings.js
////
//// Add custom settings for your environment below, then select them when
//// meteor boots by setting $METEOR_ENV in your environment. Or just put
//// ALL of the settings in $METEOR_SETTINGS (doesn't inherit from defaults).
////
//// inspiration: https://gist.github.com/ritikm/6999942
//// discussion:  https://groups.google.com/d/msg/meteor-talk/K79-i3LYL3g/yxd4_IZOErAJ
////
//// requirements:
////  - echo "export METEOR_ENV='development_osx'" > ~/.bash_profile
////  - depends on lodash.merge(), install with $ meteor add stevezhu:lodash

//////////////////////////////////////////////////////////////////////////////
// settings.museum works on the museum's ubuntu box and is selected
// automatically if no $METEOR_ENV is found

var settings = {
  museum: {
    "gphoto2":                true,
    "opencfuPath":            'opencfu',           // make sure its in the PATH
    "scannerPath":            '/dev/usbscanner',   // HID-mode scanner device path
    "platePhotosPath":        '/photos/',          // ABSOLUTE URL for gphoto & opencfu
    "fakeColonyPhotoFile":    '/photos/small.jpg', // meteor hosts everything in 'public/' at '/' from the clients perspective
    "fakeColonyData":         'colonyData.json',   // private/ - only server can read using Assets api https://dweldon.silvrback.com/get-text
    public: {
      "photoWidth":             4272,              // camera default is 4272x2848
      "photoHeight":            2848,              // small.jpg is 2100x1400
      "reticuleDuration":       2000,              // how long is the entire reticule animation? defaults to 2 sec
      "restartAfterWallUpdate": 15000,             // how long in ms before restarting the app after plateShowWallUpdate? defaults to 8 sec
    }
  }
}

//////////////////////////////////////////////////////////////////////////////
// make a deep copy of settings.museum then replace properties as desired.
// these are good defaults for a dev box, but notice opencfu is defined above.

settings.museum_no_ecolor = lodash.merge( {}, settings.museum, {
  // settings to override go here
  //"opencfuPath":            false
});

settings.development_osx = lodash.merge( {}, settings.museum, {
  "gphoto2":                false,
  "scannerPath":            false,
  "opencfuPath":            false,
  "platePhotosPath":        process.env.PWD + '/public/photos/',
  public: {
    "photoWidth":           2100,
    "photoHeight":          1400,
    "reticuleDuration":     25,
    "restartAfterWallUpdate": 3000,
  }
});

// NOTE does NOT inherit from other settings
settings.production = {
  "gphoto2":                false,
  "scannerPath":            false,
  "opencfuPath":            false,
  "platePhotosPath":        '/photos/',
  "fakeColonyData":         'colonyData.json',
  "fakeColonyPhotoFile":    '/photos/small.jpg',
  public: {
    "photoWidth":           2100,
    "photoHeight":          1400,
  },
  private: {}
}

//////////////////////////////////////////////////////////////////////////////
// get the environment variable, pick the right config object, s

console.log("settings.js: current $NODE_ENV: " + process.env.NODE_ENV);

if (process.env.NODE_ENV === 'production') {
  console.log("settings.js: detected $NODE_ENV=" + process.env.NODE_ENV);
  console.log("\t\t + assuming production environment (meteor.com hosting?)\n\t\t$METEOR_ENV set to \'production\'");
  process.env.METEOR_ENV = 'production';
}

if (process.env.METEOR_ENV) {
  environment = process.env.METEOR_ENV;
  console.log("settings.js: detected $METEOR_ENV: " + environment);
  // if the specified environment doesn't exist, default to museum
  if ( !(_.has(settings, environment)) ){
    console.log("\t " + environment + "was not found in settings.js, defaulting to museum mode");
  }
} else {
  environment = "museum";
}

//////////////////////////////////////////////////////////////////////////////
// server can access Meteor.settings
//
// client can access
//   - Meteor.settings.public (passed automatically to client)
//   - __meteor_runtime_config__.PUBLIC_SETTINGS (set below, passed automatically to client)

if (!process.env.METEOR_SETTINGS) {
  console.log("settings.js: $METEOR_SETTINGS not detected, using *" + environment + "* defined in server/lib/settings.js");

  Meteor.settings = settings[environment];
  Meteor.settings.public.environment = environment;  // nice to know later on
  Meteor.settings.public.status = [
    {"name": "plate camera", "disabled": !Meteor.settings.gphoto2, "msg": "can't find gphoto2, plate imaging disabled. Using demo picture " + Meteor.settings.fakeColonyPhotoFile},
    {"name": "barcode scanner", "disabled": !Meteor.settings.scannerPath, "msg": "can't connect to barcode scanner, ticket and plate barcode scanning disabled"},
    {"name": "openCFU", "disabled": !Meteor.settings.opencfuPath, "msg": "can't find openCFU binary, computer vision disabled. using demo data " + Meteor.settings.fakeColonyData},
  ];


  // 
  // ["gphoto2", "scannerPath", "opencfuPath"].forEach(function(mod){
  //   Meteor.settings.public.modules.push({
  //     "name": mod,
  //     "disabled": !Meteor.settings[mod]
  //   });
  // });

  // hacky trick
  if (Meteor.settings && Meteor.settings.public) {
    __meteor_runtime_config__.PUBLIC_SETTINGS = Meteor.settings.public;
  }
}
