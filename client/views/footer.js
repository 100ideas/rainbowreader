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
   'click #deletebc': function () {
    deletePlateBarcode();
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

deletePlateBarcode = function () {
  WorkstationSessions.update({_id: workstationSession}, {$unset: {plateBarcode: true}});
  // Meteor.call('createWorkstationSession', function(error, result) {
  //  workstationSession = result;
  // })
}

Template.adminStatus.helpers({
  thisArray: function() {
    console.log("thisArray: " + WorkstationSessions.findOne(workstationSession));
    return [WorkstationSessions.findOne(workstationSession).plateBarcode];
  },
})

Template.adminStatus.rendered = function () {
  
  this.animation_helper = this.firstNode;
  console.log("this.find('#admin-status-container'): " + this.animation_helper.id );
 
  this.animation_helper._uihooks = {
    insertElement: function (node, next) {
      var $node = $(node);
      $node.insertBefore(next);
      console.log("adminStatus uihooks insertElement: node:" + node );
      $node.velocity("transition.bounceRightIn", {
        // duration: ,
        // easing: ,
        complete: function () {
            $node = null;
        }
      });
    },
    removeElement: function (node) {
      var $node = $(node);
      console.log("adminStatus uihooks removeElement: node:" + node );
      $node.velocity("transition.bounceRightOut", {
        // duration: ,
        // easing: ,
        complete: function () {
          $node.remove();
          $node = null;
        }
      });      
    }
  };

  this.autorun( function () {
    var bc = WorkstationSessions.findOne(workstationSession);
    if (lodash.has(bc, "plateBarcode")){
      console.log('Template.adminStatus.autorun platebc: ' + bc.plateBarcode);
    } else {
      console.log('Template.adminStatus.autorun NO platebc!')
    }
    // $("#plate-barcode-status").velocity("callout.shake");
  });

};
/*
 
 $("#admin-buttons button").velocity("transition.slideButtonsIn", { stagger: 50, backwards: true }) 
 $("#admin-buttons button").velocity("transition.slideButtonsOut", { stagger: 50, backwards: true })

 */