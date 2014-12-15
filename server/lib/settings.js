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
    "gphoto2":                false,
    "opencfuPath":            undefined,
    "scannerPath":            '/dev/usbscanner',
    "platePhotosPath":        '/photos/',
    "fakeColonyDataFile":     '/code/rainbowreader/test/colonyData.json',
    "fakeColonyPhotoFile":    'public/photos/small.jpg',
    public: {
      "photoWidth":             4272,   // camera default is 4272x2848
      "photoHeight":            2848,   // small.jpg is 2100x1400
      "restartAfterWallUpdate": 15000    // how long in ms before restarting after plateShowWallUpdate
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
  "fakeColonyDataFile":     process.env.PWD + '/test/colonyData.json',
  "fakeColonyPhotoFile":    process.env.PWD + '/public/photos/small.jpg', // necessary cause opencfu gets confused     
  public: { 
    "photoWidth":           2100, 
    "photoHeight":          1400,
    "reticuleDuration":     1
  }
});

settings.development_nagle = lodash.merge( {}, settings.development_osx, {
  // settings to override go here
  "opencfuPath":            false
}); 

settings.alex = lodash.merge( {}, settings.development_nagle, {
  // settings to override go here
});

// NOTE does NOT inherit from other settings, is just empty
settings.production = {
  public: {},
  private: {}
}

//////////////////////////////////////////////////////////////////////////////
// get the environment variable, pick the right config object, s

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

  // hacky trick
  if (Meteor.settings && Meteor.settings.public) {
    __meteor_runtime_config__.PUBLIC_SETTINGS = Meteor.settings.public;
  }
}
