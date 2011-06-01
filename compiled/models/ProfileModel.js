(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  NameTag.ProfileModel = Backbone.Model.extend({
    initialize: function(options) {
      return _.bindAll(this, 'fetch', 'clear', 'gotProfiles', 'isEmpty');
    },
    fetch: function(options) {
      return IN.API.Profile('me').fields('id', 'firstName', 'lastName', 'headline', 'location', 'positions', 'educations', 'pictureUrl', 'publicProfileUrl').result(__bind(function(profiles) {
        return this.gotProfiles(profiles);
      }, this));
    },
    clear: function(options) {
      IN.User.logout();
      return Backbone.Model.prototype.clear.call(this, options);
    },
    gotProfiles: function(profiles) {
      return this.set(profiles.values[0]);
    },
    isEmpty: function() {
      return _.size(this.attributes) === 0;
    }
  });
}).call(this);
