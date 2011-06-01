$ ->
  NameTag.profileModel = new NameTag.ProfileModel()
  NameTag.eventModel = new NameTag.EventModel()
  NameTag.view = new NameTag.NameTagView el: $('#main'), profileModel: NameTag.profileModel, eventModel: NameTag.eventModel
  NameTag.controller = new NameTag.NameTagController profileModel: NameTag.profileModel, eventModel: NameTag.eventModel, view: NameTag.view

  Backbone.history.start();
  
  window.onLinkedInLoad = NameTag.controller.onLinkedInLoad
  
  $.getScript 'http://platform.linkedin.com/in.js?async=true', ->
    IN.init
      onLoad: 'onLinkedInLoad'
      api_key: 'OJcd6q1udIndF9vAJZ073iRENrrPz9FTrGQ0PSsl1eJyO4wASCSi7DDiFMOUd1Rz'
      authorize: true

