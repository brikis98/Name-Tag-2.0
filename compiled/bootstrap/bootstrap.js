(function() {
  $(function() {
    NameTag.profileModel = new NameTag.ProfileModel();
    NameTag.eventModel = new NameTag.EventModel();
    NameTag.view = new NameTag.NameTagView({
      el: $('#main'),
      profileModel: NameTag.profileModel,
      eventModel: NameTag.eventModel
    });
    NameTag.controller = new NameTag.NameTagController({
      profileModel: NameTag.profileModel,
      eventModel: NameTag.eventModel,
      view: NameTag.view
    });
    Backbone.history.start();
    window.onLinkedInLoad = NameTag.controller.onLinkedInLoad;
    return $.getScript('http://platform.linkedin.com/in.js?async=true', function() {
      return IN.init({
        onLoad: 'onLinkedInLoad',
        api_key: 'ZUZeWwJRSDulsA9nTSQuAL_ediXMebLTSgQ3YeyPamTdaFO8xe_8MYMdSQtDJ_LY',
        authorize: true
      });
    });
  });
}).call(this);
