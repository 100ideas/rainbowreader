//if we're not at the museum, show some debugging states.

Template.plateHello.notMuseum = function(){
  return Meteor.settings.public.environment != 'museum';
}

Template.plateHello.rendered = function() {
  Meteor.settings.public.status.forEach(function(m,i){
    if(m.disabled){
      Meteor.setTimeout(function(){
        toastr.error(m.msg, m.name, {"timeOut": "10000"});
      }, 500 * (i+1))
    }
  })
}
