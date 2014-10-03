//if we're not at the museum, show some debugging states.

Template.plateHello.notMuseum = function(){
  return Meteor.settings.public.environment != 'museum';
}
Template.plateHello.helpers({
  userBarcode: function () {
    var ws = WorkstationSessions.findOne(workstationSession);
    return ws.userBarcode;
  }
});