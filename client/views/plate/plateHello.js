//if we're not at the museum, show some debugging states.

Template.plateHello.notMuseum = function(){

    var currentEnvironment = getEnvironment();
    console.log(currentEnvironment);
    return (!("museum" == currentEnvironment));
    return true;
}
