var NameTagController = Backbone.Controller.extend({
  initialize: function(options) {
    _.bindAll(this, 'index', 'logout', 'onLinkedInLoad', 'onLinkedInAuth', 'routeToCustomize', 'ensureLogin', 'renderWithProfile', 'nameTag');
    _.extend(this, Backbone.Events);
    
    this.view = options.view;
    this.view.controller = this;
    
    this.profileModel = options.profileModel;
    this.eventModel = options.eventModel;
    
    var that = this;
    this.route('customize/' + this.eventModel.getRoutePattern(), 'customize', function() {
      that.nameTag(arguments, that.view.renderCustomize);
    });

    this.route('show/' + this.eventModel.getRoutePattern(), 'show', function() {
      that.nameTag(arguments, that.view.renderShow);
    });
    
    this.profileModel.bind('change', this.view.toggleLogout);
  },
  
  routes: {
    '':                                                      'index',            // #    
    'customize':                                             'routeToCustomize', // #customize
    'logout':                                                'logout'            // #logout
  },
  
  index: function() {
    this.view.render();
  },
  
  routeToCustomize: function(useModel) {
    window.location.hash = '#customize/' + this.eventModel.url(); 
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
  
  nameTag: function(args, renderCallback) {
    this.eventModel.update(args);    
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