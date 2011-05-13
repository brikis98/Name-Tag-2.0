var ProfileModel = Backbone.Model.extend({
  initialize: function(options) {
    _.bindAll(this, 'fetch', 'gotProfiles', 'isEmpty');
  },
  
  fetch: function(options) {
    IN.API
      .Profile('me')
      .fields('id', 'firstName', 'lastName', 'headline', 'location', 'positions', 'educations', 'pictureUrl', 'publicProfileUrl')
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