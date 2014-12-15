// Browser UI state machine
(function() {
  // exposing list of states might be useful
  // hide it for now to force people to use the provided functions
  var states = [
    "loading",          // meteor has yet to establish session (mainly for debug)
    "hello",            // landing page
    "introduction",     // 
    "instructions",     // instruct use how to take photo and wait for photo
    "photo",            // show photo and draw reticles over colonies
    "reticlesDone",     // reticles finished animating
    "rareColors",       // show rare colors
    "end"               // blur photo; session completed
  ];

  // always return a valid state; if the session has yet to be created, return the first state
  uiGetState = function() {
    var doc = WorkstationSessions.findOne(workstationSession);
    if (!doc || !doc.uiState) return states[0];
    return doc.uiState;
  }

  // use this before calling uiAdvanceState to ensure you're in the right state without
  // making your code brittle to some one inserting a new state 
  uiGetNextState = function() {
    var index = states.indexOf(uiGetState());
    if (index === -1) return states[0]; //or should this be states[1]?
    else return states[index+1];
  }

  // use with caution!  expose this function if you want non-linear state transitions
  function uiSetState(newState) {
    if (typeof workstationSession !== 'string') console.log('Error: no session document'); 
    else WorkstationSessions.update(workstationSession, {$set: {uiState: newState}});
  }

  uiIsLastState = function() {
    return uiGetState() == states[states.length-1];
  }

  // go to beginning
  uiResetState = function() {
    uiSetState(states[0]);
  }

  // move to next state (for linear state machines)
  uiAdvanceState = function() {
    var curState = uiGetState();
    var index = states.indexOf(curState);
    if (index == -1) {
      console.log('Error: Invalid UI state: ' + curState);
    }
    else if (index >= states.length) {
      console.log('Error: Advancing past last state.  Use the reset function if this is intentional.');
    }
    else {
      var newState = states[index + 1];
      uiSetState(newState);
      return newState;
    }
  }
})();
