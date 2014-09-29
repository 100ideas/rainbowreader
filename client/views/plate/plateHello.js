//if we're not at the museum, show some debugging states.

Template.plateHello.notMuseum = function(){
  // return typeof Admin.findOne() === 'undefined' ? 'NOT_CONNECTED' : Admin.findOne().environment;
  if (AdminSubscriptionReady() )
    return Admin.findOne().environment;
  else 
    return "NOT_CONNECTED";
}