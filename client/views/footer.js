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
  if (workstationSession) {
    console.log("deletePlateBarcode: workstationSession: " + workstationSession);
    WorkstationSessions.update({_id: workstationSession}, {$unset: {plateBarcode: true}});
  } else {
    Meteor.call('createWorkstationSession', function(error, result) {
      workstationSession = result;
    });
  }
}

Template.adminStatus.helpers({
  thisArray: function() {
    var ws = WorkstationSessions.findOne(workstationSession);
    // if (!ws) return "";
    // ws.hasOwnProperty("plateBarcode") ? ws.plateBarcode : "";
    // need to return a cursor for reactivity?
    return [WorkstationSessions.findOne(workstationSession).plateBarcode];
  },
})

Template.adminStatus.rendered = function () {
  this.animation_helper = this.firstNode;
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
      // debugger;
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

  // this.autorun( function () {
  //   var bc = WorkstationSessions.findOne(workstationSession);
  //   if (lodash.has(bc, "plateBarcode")){
  //     console.log('Template.adminStatus.autorun platebc: ' + bc.plateBarcode);
  //   } else {
  //     console.log('Template.adminStatus.autorun NO platebc!')
  //   }
  //   // $("#plate-barcode-status").velocity("callout.shake");
  // });

};