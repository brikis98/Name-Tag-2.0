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
    '':                                                      'index',            // #
    'customize/:name/:extended/:namePositionTop/*logo':      'customize',        // #customize/Talent+Connect/logo.png/false
    'customize':                                             'routeToCustomize', // #customize
    'show/:name/:extended/:namePositionTop/*logo':           'show',             // #show/Talent+Connect/logo.png/false
    'logout':                                                'logout'            // #logout
  },
  
  index: function() {
    this.view.render();
  },
  
  routeToCustomize: function(useModel) {
    window.location.hash = '#customize/' + this.eventModel.url(); 
  },
  
  customize: function(name, extended, namePositionTop, logo) {    
    this.nameTag(name, extended, namePositionTop, logo, this.view.renderCustomize);
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
  
  show: function(name, extended, namePositionTop, logo) {
    this.nameTag(name, extended, namePositionTop, logo, this.view.renderShow);
  },
  
  nameTag: function(name, extended, namePositionTop, logo, renderCallback) {
    if (name && extended && logo) {
      this.eventModel.set({eventName: decodeURIComponent(name), eventLogo: decodeURIComponent(logo), namePositionTop: decodeURIComponent(namePositionTop) == 'true', extended: decodeURIComponent(extended) == 'true'});  
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