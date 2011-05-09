var EventModel = Backbone.Model.extend({
  initialize: function(options) {
    _.bindAll(this, 'url');
  },
  
  defaults: {
    eventLogo: 'http://' + window.location.host + '/images/logo.png', 
    eventName: 'LinkedIn Talent Connect 2011', 
    extended: false
  },
  
  url: function() {
    return encodeURIComponent(this.get('eventName')) + '/' + encodeURIComponent(this.get('extended')) + "/" + encodeURIComponent(this.get('eventLogo'));
  }  
});

var ProfileModel = Backbone.Model.extend({
  initialize: function(options) {
    _.bindAll(this, 'fetch', 'gotProfiles', 'isEmpty');
  },
  
  fetch: function(options) {
    IN.API
      .Profile('me')
      .fields('id', 'firstName', 'lastName', 'headline', 'location', 'positions', 'educations', 'pictureUrl')
      .result(this.gotProfiles);    
  },
  
  clear: function(options) {
    IN.User.logout();
    Backbone.Model.prototype.clear.call(this, options);
  },
  
  gotProfiles: function(profiles) {
    this.set(profiles.values[0]);
  },
  
  isEmpty: function() {
    return _.size(this.attributes) == 0;
  } 
});

var NameTagController = Backbone.Controller.extend({
  initialize: function(options) {
    _.bindAll(this, 'index', 'customize', 'show', 'logout', 'onLinkedInLoad', 'onLinkedInAuth', 'routeToCustomize', 'requireLogin');
    _.extend(this, Backbone.Events);
    
    this.view = options.view;
    this.view.controller = this;
    
    this.profileModel = options.profileModel;
    this.eventModel = options.eventModel;
    
    this.profileModel.bind('change', this.view.toggleLogout);
  },
  
  routes: {
    '':                                     'index',            // #
    'customize/:name/:extended/*logo':      'customize',        // #customize/Talent+Connect/logo.png/false
    'customize':                            'routeToCustomize', // #customize
    'show/:name/:extended/*logo':           'show',             // #show/Talent+Connect/logo.png/false
    'logout':                               'logout'            // #logout
  },
  
  index: function() {
    this.view.render();
  },
  
  routeToCustomize: function(useModel) {
    window.location.hash = '#customize/' + this.eventModel.url(); 
  },
  
  customize: function(name, extended, logo) {
    
    if (name && extended && logo) {
      this.eventModel.set({eventName: name, eventLogo: logo, extended: extended == 'true'});  
    }
    
    if (typeof IN !== 'undefined' && IN && IN.User) {
      if (IN.User.isAuthorized()) {
        if (this.profileModel.isEmpty()) {
          this.profileModel.bind('change', _.once(this.customize));
        } else {
          this.view.render('customize', this.view.getFullContext());  
        }                
      } else {
        this.requireLogin();
      }     
    } else {
      this.bind('onLinkedInLoad', this.requireLogin);
    }
  },
  
  requireLogin: function() {
    this.view.render('login');
    this.view.parse(this.view.el);
    IN.Event.on(IN, 'auth', this.customize);
  },
  
  show: function(name, extended, logo) {
    console.log('show');
  },
  
  logout: function() {
    this.profileModel.clear();
    window.location.hash = '';
  },
  
  onLinkedInLoad: function() {
    this.view.parse();
    this.trigger('onLinkedInLoad');
    IN.Event.on(IN, 'auth', this.onLinkedInAuth);
  },
  
  onLinkedInAuth: function() {
    this.profileModel.fetch();
  }  
});

var NameTagView = Backbone.View.extend({
  initialize: function(options) {
    _.bindAll(this, 'render', 'parse', 'toggleLogout', 'eventOptionsChanged', 'updateBadge', 'getFullContext');
    
    this.logoutContainer = '#logout-container';        
    this.loginContainer = '#login-container';
    this.badgeContainer = '#badge';
    this.optionsForm = '#options-form';
    
    this.profileModel = options.profileModel;
    this.eventModel = options.eventModel;  
    
    this.eventModel.bind('change', this.updateBadge);  
  },
  
  events: {
    'change input.event-options':     'eventOptionsChanged'
  },
  
  createDustBase: function() {
    return dust.makeBase({
      loop: function(chunk, context, bodies, params) {
        var list = context.current();
        var start = params.start || 0;
        var end = params.end || list.length;
        
        if (start < 0) {
          start = 0;
        }
        if (end > list.length) {
          end = list.length;
        }
        
        for (var i = start; i < end; i++) {
          chunk.render(bodies.block, context.rebase(list[i]));
        }
        return chunk;
      }
    });  
  },
  
  getFullContext: function() {
    return _.extend(this.profileModel.attributes, this.eventModel.attributes);
  },
  
  updateBadge: function() {
    this.controller.routeToCustomize();
  },
  
  eventOptionsChanged: function(event) {
    var values = $(this.optionsForm).serializeObject();
    values.extended = values.extended == 'true';
    this.eventModel.set(values);
  },
  
  parse: function(container) {
    container = container || this.loginContainer;
    IN.parse($(container).get(0));
  },
  
  toggleLogout: function() {
    if (this.profileModel.isEmpty()) {
      $(this.logoutContainer).empty();
    } else {
      this.render('logout', this.profileModel.attributes, this.logoutContainer);
    }
  },  
  
  render: function(template, context, container) {
    container = container || this.el;
    template = template || 'landing';
    context = this.createDustBase().push(context || {});
    dust.render(template, context, function(err, out) {
      $(container).html(err ? err : out);
    });    
  }
});

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
