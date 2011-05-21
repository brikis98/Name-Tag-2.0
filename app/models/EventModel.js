var EventModel = Backbone.Model.extend({
  initialize: function(options) {
    _.bindAll(this, 'url', 'getUrl', 'encodeValue', 'getRoutePattern', 'update', 'set', 'cleanupValue');
    
    this.profileModel = options.profileModel;
    this.profileModel.eventModel = this;
  },
  
  defaults: { 
    eventName: 'LinkedIn Talent Connect 2011',
    namePositionTop: false, 
    extended: false,
    style: 'gray',
    eventLogo: 'http://' + window.location.host + '/images/logo.png'
  },
  
  url: function() {
    return this.getUrl(true);
  },
  
  getUrl: function(escaped) {
    var that = this;
    return _.map(this.attributes, function(value, key) { return that.encodeValue(value, escaped); }).join('/');
  },
  
  encodeValue: function(value, escape) {
    return escape ? encodeURIComponent(value) : value;
  },
  
  getRoutePattern: function() {
    var that = this;
    return _.map(this.attributes, function(value, key) { 
      return (key == 'eventLogo' ? '*' : ':') + key; 
    }).join('/');
  },
  
  update: function(args) {
    if (!args) {
      return;
    }

    var values = _.values(args);
    var keys = _.keys(this.attributes);
    
    if (values.length != keys.length) {
      return;
    }
    
    var newValues = {};
    for (var i = 0; i < values.length; i++) {
      newValues[keys[i]] = values[i];
    }

    this.set(newValues);
  },
  
  set: function(attributes, options) {
    var that = this;
    _.each(attributes, function(value, key) {
      attributes[key] = that.cleanupValue(key, value);
    });
    Backbone.Model.prototype.set.call(this, attributes, options);
  },
  
  cleanupValue: function(key, value) {
    if (_.isBoolean(this.get(key))) {
      return value == 'true';
    }
    return value;
  }  
});