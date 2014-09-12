Template.plateMeasurementInstruction.created = function(){

  Session.set("plateMeasurementCountdown",30);
};


var countOneSecond = function(){

  var currentTime = Session.get("plateMeasurementCountdown");

  Session.set("plateMeasurementCountdown",(Session.get("plateMeasurementCountdown") - 1));

}


    var intervalHandle;

Template.plateMeasurementInstruction.rendered = function(){


  intervalHandle = Meteor.setInterval(countOneSecond,1000);


}

Template.plateMeasurementInstruction.countdown = function(){

  if (Session.get("plateMeasurementCountdown") <= 0)
  {
    Meteor.clearInterval(intervalHandle);
  }

  return Session.get("plateMeasurementCountdown");

}
