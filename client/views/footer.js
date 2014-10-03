Template.footer.events({
  'click #admin-button': function () {
    toggleAdminBar(); // lib/velocity.js
   },
   'click #userbc': function () {
    fakeUserBarcode();
   },
   'click #platebc': function () {
    fakePlateBarcode();
   },
   'click #restart': function () {
    location.reload();
   },      
   'click #nobg': function () {
    $("#nobg").text(changeBackgroundImg());
   },     
  'click #bill': function () {
    $("#bill").text(changeBackgroundImg('bill'));
   }
});

/*
 
 $("#admin-buttons button").velocity("transition.slideButtonsIn", { stagger: 50, backwards: true }) 
 $("#admin-buttons button").velocity("transition.slideButtonsOut", { stagger: 50, backwards: true })

 */