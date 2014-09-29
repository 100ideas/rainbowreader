//if we're not at the museum, show some debugging states.

Template.plateHello.notMuseum = function(){
  // return typeof Admin.findOne() === 'undefined' ? 'NOT_CONNECTED' : Admin.findOne().environment;
  if (AdminSubscription.ready()){
    console.log("Admin.findOne().environment: " + Admin.findOne().environment);
    return Admin.findOne().environment === 'museum';
  }else {
    return 'NOT_CONNECTED';
  }
}