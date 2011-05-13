var EventModel = Backbone.Model.extend({
  initialize: function(options) {
    _.bindAll(this, 'url', 'getUrl', 'encodeValue');
  },
  
  defaults: {
    eventLogo: 'http://' + window.location.host + '/images/logo.png', 
    eventName: 'LinkedIn Talent Connect 2011',
    namePositionTop: false, 
    extended: false
  },
  
  url: function() {
    return this.getUrl(true);
  },
  
  getUrl: function(escaped) {
    return this.encodeValue(this.get('eventName'), escaped) + '/' + 
           this.encodeValue(this.get('extended'), escaped) + "/" + 
           this.encodeValue(this.get('namePositionTop'), escaped) + "/" +
           this.encodeValue(this.get('eventLogo'), escaped);
  },
  
  encodeValue: function(value, escape) {
    return escape ? encodeURIComponent(value) : value;
  }  
});