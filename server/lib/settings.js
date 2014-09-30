// inspiration https://gist.github.com/ritikm/6999942
// discussion https://groups.google.com/d/msg/meteor-talk/K79-i3LYL3g/yxd4_IZOErAJ
// be sure to set the METEOR_ENV environment variable i.e. in ~/.bash_profile:
// export METEOR_ENV='development_osx'


// recursively adds or updates properties of target w/ props of source
// ...cause I like javascript object literal syntax
var updateKeys = function(target, source){
  return (function(t,s){
    for (var p in s){
      if (s[p] instanceof Object) {
        arguments.callee( t[p], s[p] );
      }else{
        if ( typeof s[p] != 'undefined' ){ t[p] = s[p] }
      }
    }
    return t;
  })(target,source);
}

var settings = {
  museum: {
    public: {
      "photoWidth":             4272,   // camera default is 4272x2848
      "photoHeight":            2848,   // small.jpg is 2100x1400
      "refreshTimeout":         8000    // how long in ms before restarting after plateShowWallUpdate
    },
    private: {
      "gphoto2":                true,
      "opencfuPath":            'opencfu',
      "scannerPath":            '/dev/usbscanner',
      "platePhotosPath":        '/photos/',
      "fakeColonyDataFile":     '/code/rainbowreader/test/colonyData.json',
      "fakeColonyPhotoFile":    'public/photos/small.jpg'
    }
  }
}

// duplicate museum settings, then override w/ updateKeys(target, source) as needed
settings.development_osx = Object.create(settings.museum);
updateKeys(settings.development_osx, {
  public: {
    "photoWidth":             2100, // smaller is faster
    "photoHeight":            1400
  },
  private: {
    "gphoto2":                false,
    "opencfuPath":            'opencfu',
    "scannerPath":            false,
    "platePhotosPath":        process.env.PWD + '/public/photos/',
    "fakeColonyDataFile":     process.env.PWD + '/test/colonyData.json',
    "fakeColonyPhotoFile":    process.env.PWD + '/public/photos/small.jpg' // necessary cause opencfu gets confused     
  }
});

// duplicate existing settings, then override w/ updateKeys(target, source) as needed
settings.development_nagle = Object.create(settings.development_osx);
updateKeys(settings.development_nagle, {
  private: {
    "gphoto2":                false,
    "opencfuPath":            false,
    "scannerPath":            false,    
  }
});

// duplicate existing settings, then override w/ updateKeys(target, source) as needed
settings.alex = Object.create(settings.development_nagle);
// updateKeys(settings.development_nagle, {
//   public: {},
//   private: {}
// });

// NOTE does NOT inherit from other settings, is just empty
settings.production = {
  public: {},
  private: {}
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

if (!process.env.METEOR_SETTINGS) {
  console.log("settings.js: $METEOR_SETTINGS not detected, using *" + environment + "* defined in server/lib/settings.js");

  Meteor.settings = settings[environment].private;
  Meteor.settings.public = settings[environment].public;
  Meteor.settings.environment, Meteor.settings.public.environment = environment;  // nice to know later on

  // Push a subset of settings to the client.
  // We also push public settings into the Admin collection in server/main.js
  if (Meteor.settings && Meteor.settings.public) {
    __meteor_runtime_config__.PUBLIC_SETTINGS = Meteor.settings.public;
  }
}
