(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  NameTag.NameTagController = Backbone.Controller.extend({
    initialize: function(options) {
      _.bindAll(this, 'index', 'routeToCustomize', 'renderWithProfile', 'ensureLogin', 'nameTag', 'logout', 'onLinkedInLoad', 'onLinkedInAuth');
      _.extend(this, Backbone.Events);
      this.view = options.view;
      this.view.controller = this;
      this.profileModel = options.profileModel;
      this.eventModel = options.eventModel;
      this.route("customize/" + (this.eventModel.getRoutePattern()), 'customize', __bind(function() {
        return this.nameTag(arguments, this.view.renderCustomize);
      }, this));
      this.route("show/" + (this.eventModel.getRoutePattern()), 'show', __bind(function() {
        return this.nameTag(arguments, this.view.renderShow);
      }, this));
      return this.profileModel.bind('change', this.view.toggleLogout);
    },
    routes: {
      '': 'index',
      'customize': 'routeToCustomize',
      'logout': 'logout'
    },
    index: function() {
      return this.view.render();
    },
    routeToCustomize: function() {
      return window.location.hash = "#customize/" + (this.eventModel.url());
    },
    renderWithProfile: function(callback) {
      if (this.profileModel.isEmpty()) {
        return this.profileModel.bind('change', _.once(callback));
      } else {
        return callback();
      }
    },
    ensureLogin: function(callback) {
      if ((typeof IN !== "undefined" && IN !== null) && IN.User) {
        if (IN.User.isAuthorized()) {
          return callback();
        } else {
          IN.Event.on(IN, 'auth', callback);
          this.view.render('login');
          return this.view.parse(this.view.el);
        }
      } else {
        return this.bind('onLinkedInLoad', __bind(function() {
          return this.ensureLogin(callback);
        }, this));
      }
    },
    nameTag: function(args, renderCallback) {
      this.eventModel.update(args);
      return this.ensureLogin(__bind(function() {
        return this.renderWithProfile(renderCallback);
      }, this));
    },
    logout: function() {
      this.profileModel.clear();
      return window.location.hash = '';
    },
    onLinkedInLoad: function() {
      this.view.parse();
      this.trigger('onLinkedInLoad');
      return IN.Event.on(IN, 'auth', this.onLinkedInAuth);
    },
    onLinkedInAuth: function() {
      return this.profileModel.fetch();
    }
  });
}).call(this);
