Template.plateMeasurementInstruction.created = function(){

  Session.set("plateMeasurementCountdown",10);
  Session.set("photoTimerDone",false)
};


var countOneSecond = function(){

  var currentTime = Session.get("plateMeasurementCountdown");

  if (Session.get("plateMeasurementCountdown") >= 0)
  {
    Session.set("plateMeasurementCountdown",(Session.get("plateMeasurementCountdown") - 1));
  }
}


    var intervalHandle = '';

Template.plateMeasurementInstruction.rendered = function(){

  if (!intervalHandle)
  {
    intervalHandle = Meteor.setInterval(countOneSecond,1000);
  }

}

Template.plateMeasurementInstruction.countdown = function(){

  if (Session.get("plateMeasurementCountdown") <= 0)
  {
    Meteor.clearInterval(intervalHandle);

    if (!(Session.get("photoTimerDone"))){
      Meteor.call('takeAndAnalyzePhoto', getSessionDocument().plateBarcode);
    }


    Session.set("photoTimerDone",true)

  }

  return Session.get("plateMeasurementCountdown");

}
