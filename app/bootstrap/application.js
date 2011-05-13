$(function() {
  var profileModel = new ProfileModel();
  var eventModel = new EventModel();
  var view = new NameTagView({el: $('#main'), profileModel: profileModel, eventModel: eventModel});
  var controller = new NameTagController({profileModel: profileModel, eventModel: eventModel, view: view});
  Backbone.history.start();
  
  window.onLinkedInLoad = controller.onLinkedInLoad;  
  
  $.getScript('http://platform.linkedin.com/in.js?async=true', function() {
    IN.init({
      onLoad: 'onLinkedInLoad',
      api_key: 'OJcd6q1udIndF9vAJZ073iRENrrPz9FTrGQ0PSsl1eJyO4wASCSi7DDiFMOUd1Rz',
      authorize: true
    });
  }); 
});
