var EventModel = Backbone.Model.extend({
  initialize: function(options) {
    _.bindAll(this, 'url', 'getUrl', 'encodeValue');
  },
  
  defaults: {
    eventLogo: 'http://' + window.location.host + '/images/logo.png', 
    eventName: 'LinkedIn Talent Connect 2011', 
    extended: false
  },
  
  url: function() {
    return this.getUrl(true);
  },
  
  getUrl: function(escaped) {
    return this.encodeValue(this.get('eventName'), escaped) + '/' + this.encodeValue(this.get('extended'), escaped) + "/" + this.encodeValue(this.get('eventLogo'), escaped);
  },
  
  encodeValue: function(value, escape) {
    return escape ? encodeURIComponent(value) : value;
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
    _.bindAll(this, 'index', 'customize', 'show', 'logout', 'onLinkedInLoad', 'onLinkedInAuth', 'routeToCustomize', 'ensureLogin', 'renderWithProfile', 'nameTag');
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
    this.nameTag(name, extended, logo, this.view.renderCustomize);
  },
  
  renderWithProfile: function(callback) {
    if (this.profileModel.isEmpty()) {
      this.profileModel.bind('change', _.once(callback));
    } else {
      callback();
    }
  },
  
  ensureLogin: function(callback) {
    if (typeof IN !== 'undefined' && IN && IN.User) {
      if (IN.User.isAuthorized()) {
        callback();               
      } else {
        IN.Event.on(IN, 'auth', callback);
        this.view.render('login');
        this.view.parse(this.view.el);        
      }     
    } else {
      var that = this;
      this.bind('onLinkedInLoad', function() { that.ensureLogin(callback); });
    }    
  },
  
  show: function(name, extended, logo) {
    this.nameTag(name, extended, logo, this.view.renderShow);
  },
  
  nameTag: function(name, extended, logo, renderCallback) {
    if (name && extended && logo) {
      this.eventModel.set({eventName: decodeURIComponent(name), eventLogo: decodeURIComponent(logo), extended: decodeURIComponent(extended) == 'true'});  
    }
    
    var that = this;
    this.ensureLogin(function() { that.renderWithProfile(renderCallback); });    
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
    _.bindAll(this, 'render', 'parse', 'toggleLogout', 'eventOptionsChanged', 'getFullContext', 'renderCustomize', 'renderShow', 'done', 'getDoneOverlay', 'renderWithCallback', 'print');
    
    this.logoutContainer = '#logout-container';        
    this.loginContainer = '#login-container';
    this.badgeContainer = '#badge';
    this.doneContainer = '#done-contents';
    this.optionsForm = '#options-form';
    
    this.profileModel = options.profileModel;
    this.eventModel = options.eventModel;    
  },
  
  events: {
    'change input.event-options':     'eventOptionsChanged',
    'click .blue-button':             'done',
    'click #print a':                 'print'
  },

  print: function(event) {
    event.preventDefault();
    
    // Super hacky "print" window.
    var printWindow = window.open('', 'Print Name Tag | Name Tag 2.0', 'height=550, width=500');
    var printDocument = printWindow.document;
    this.renderWithCallback('badge', _.extend({}, this.getFullContext(), {hidePrint: true}), function(out) {
      printDocument.write('<html><head><link href="css/main.css" rel="stylesheet" type="text/css"/></head><body>' + out + '</body></html>');
      printDocument.close();
    });    
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
  
  done: function() {
    this.getDoneOverlay().overlay().load();
  },
  
  getDoneOverlay: function() {
    var that = this;
    if (!this.doneOverlay) {
      this.doneOverlay = $('#done-overlay').overlay({
        mask: {
          color: '#ebecff',
          loadSpeed: 200,
          opacity: 0.9
        },
        oneInstance: false,
        onBeforeLoad: function() {
          that.shortenUrl('http://' + window.location.host + '#show/' + that.eventModel.url(), function(shortUrl) {
            that.render('done', {showUrl: shortUrl}, that.doneContainer);  
          });          
        }  
      });      
    }
    return this.doneOverlay;
  },
  
  shortenUrl: function(url, callback) {
    jsonlib.fetch({
      url: 'https://www.googleapis.com/urlshortener/v1/url', 
      header: 'Content-Type: application/json', 
      data: JSON.stringify({longUrl: url})
    }, function(response) {
      callback(JSON.parse(response.content).id);
    });
  },
  
  getFullContext: function() {
    return _.extend({}, this.profileModel.attributes, this.eventModel.attributes);
  },
  
  renderCustomize: function() {
    this.render('customize', _.extend({}, this.getFullContext(), {hidePrint: true}));
  },
  
  renderShow: function() {
    this.render('badge', this.getFullContext());
  },
  
  eventOptionsChanged: function(event) {
    var values = $(this.optionsForm).serializeObject();
    values.extended = values.extended == 'true';
    this.eventModel.set(values);
    this.controller.routeToCustomize();
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
  
  renderWithCallback: function(template, context, callback) {    
    template = template || 'landing';
    context = this.createDustBase().push(context || {});
    dust.render(template, context, function(err, out) {
      callback(err ? err : out);
    });    
  },
  
  render: function(template, context, container) {
    container = container || this.el;
    this.renderWithCallback(template, context, function(out) {
      $(container).html(out);
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
