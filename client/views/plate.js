// show the image and colony animations
Template.plate.showDishPhoto = function () {
  var doc = getSessionDocument();
  if (!doc || !doc.photoURL) return false;
  return doc.photoURL;
};