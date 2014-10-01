Template.footer.events({
  'click #bill': function () {
    changeBackgroundImg();
   },
   'click #restart': function () {
      location.reload();
   },
   'click #vmd': function () {
      var vmd=document.createElement("script"); 
      vmd.src="//julian.com/research/velocity/vmd.min.js"; 
      document.body.appendChild(vmd); 
   }
});