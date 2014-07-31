// source https://gist.github.com/ritikm/6999942
// discussion https://groups.google.com/d/msg/meteor-talk/K79-i3LYL3g/yxd4_IZOErAJ

if (process.env.METEOR_ENV) {
  environment = process.env.METEOR_ENV;
  console.log("settings.js: detected $METEOR_ENV: " + environment);
} else {
  environment = "development";
  console.log("settings.js: can't find $METEOR_ENV, using default *development* environment");
}
 
var settings = {
  development: {
    public: {},
    private: {
      "fakeMode": false,
    	"opencfuPath": '/home/administrator/dev/opencfu/opencfu',
		  "scannerPath": '/dev/hidraw3',
		  "fakeColonyDataPath": '/code/rainbowreader/test/colonyData.json',
      "colonyPhotoPath": "public/photos/"
    }
  },
  development_osx: {
    public: {},
    private: {
      "fakeMode": true,
    	"opencfuPath": '/Users/macowell/dev/museum/opencfu',
		  "scannerPath": '',
		  "fakeColonyDataPath": process.env.PWD + '/test/colonyData.json',
      "colonyPhotoPath": process.env.PWD + '/public/photos/small.jpg'
    }
  },
  production: {
    public: {},
    private: {}
  }
};
 
if (!process.env.METEOR_SETTINGS) {
  console.log("settings.js: No METEOR_SETTINGS passed in,\n\tusing *" + environment + "* defined in settings.js");
 
  if (environment === "production") {
    Meteor.settings = settings.production.private;
  } else if (environment === "development_osx") {
    Meteor.settings = settings.development_osx.private;
  } else {
    Meteor.settings = settings.development.private;
  }
 
  // Push a subset of settings to the client.
  if (Meteor.settings && Meteor.settings.public) {
    __meteor_runtime_config__.PUBLIC_SETTINGS = Meteor.settings.public;
  }
}