// source https://gist.github.com/ritikm/6999942
// discussion https://groups.google.com/d/msg/meteor-talk/K79-i3LYL3g/yxd4_IZOErAJ

environment = process.env.METEOR_ENV || "development";
 
var settings = {
  development: {
    public: {},
    private: {
    	"opencfuPath": '/home/administrator/dev/opencfu/opencfu',
		"scannerPath": '/dev/hidraw3',
		"backupFilePath": '/code/rainbowreader/test/colonyData.json'
    }
  },
  development_osx: {
    public: {},
    private: {
    	"opencfuPath": '/home/administrator/dev/opencfu/opencfu',
		"scannerPath": ' ',
		"backupFilePath": './test/colonyData.json'
    }
  },
  production: {
    public: {},
    private: {}
  }
};
 
if (!process.env.METEOR_SETTINGS) {
  console.log("=> No METEOR_SETTINGS passed in, using locally defined settings.");
 
  if (environment === "production") {
    Meteor.settings = settings.production;
  } else if (environment === "development_osx") {
    Meteor.settings = settings.development_osx;
  } else {
    Meteor.settings = settings.development;
  }
 
  // Push a subset of settings to the client.
  if (Meteor.settings && Meteor.settings.public) {
    __meteor_runtime_config__.PUBLIC_SETTINGS = Meteor.settings.public;
  }
}