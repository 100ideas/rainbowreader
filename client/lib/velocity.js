// Velocity 1.1.0 changed syntax to RegisterEffect() 
$.Velocity.RegisterUI("transition.slideButtonsIn", {
    defaultDuration: 300,
    calls: [
      [
        { translateX: [0, function () {return this.parentElement.clientWidth * -1 - this.clientWidth;}] }, 
        1, 
        { easing: [300, 25] }
      ]
    ]
  });

$.Velocity.RegisterUI("transition.slideButtonsOut", {
    defaultDuration: 400,
    calls: [ 
      [ 
        { translateX: function () { return this.parentElement.clientWidth * -1 - this.clientWidth;} }, 
        1, 
        { easing: [300, 25] }      
      ]
    ]
  });

toggleAdminBar = function (){
  var adminButtons = $("#admin-buttons button");
  var adminStatus = $("#admin-status");
  // need to detect animating state, not just hidden or visible

  if( adminButtons.hasClass('velocity-animating') ) {
    //do nothing, we're animating: spin the button, but don't queue any velocity animatons
    $("#admin-button").velocity("callout.shake");
    console.log("click ignoreed, currently animating")
  } else if (adminButtons.css("display") === 'none') {
    adminButtons.velocity("transition.slideButtonsIn", {
      stagger: 10, 
      drag: true,
      begin: function() {document.getElementById("admin-button").setAttribute("disabled", "disabled")},
                          // $("#admin-button").attr("disabled", "disabled");
                          // $("#admin-button i").addClass("fa-spin");
      complete: function() {document.getElementById("admin-button").removeAttribute("disabled")}      
    });
    adminStatus.velocity("transition.slideRightBigIn");
  } else {
    adminButtons.velocity("transition.slideButtonsOut", {
      stagger: 10, 
      drag: true,
      backwards: true,
      begin: function() {document.getElementById("admin-button").setAttribute("disabled", "disabled")},
      complete: function() {document.getElementById("admin-button").removeAttribute("disabled")}        
    });
    adminStatus.velocity("transition.slideRightBigOut");
  }
}

// var toggleAdminBar2 = function (){
//   var adminButtons = $("#admin-buttons");
//   if (adminButtons.css("display") === 'none') {
//     adminButtons.velocity(
//       { 
//         translateX: [0, $("#admin-buttons").width() * -1 -40] 
//       },{
//         easing: [300, 20], 
//         duration: 2000, 
//         display: "inline-block" 
//       }
//     );
//   }else{
//     adminButtons.velocity("reverse");
//   }
// }