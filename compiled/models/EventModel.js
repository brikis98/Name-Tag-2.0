(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  NameTag.EventModel = Backbone.Model.extend({
    initialize: function(options) {
      return _.bindAll(this, 'url', 'getUrl', 'encodeValue', 'getRoutePattern', 'update', 'set', 'cleanupValue');
    },
    defaults: {
      eventName: 'LinkedIn Talent Connect 2011',
      namePositionTop: false,
      extended: false,
      style: 'gray',
      eventLogo: "http://" + window.location.host + "/img/logo.png"
    },
    url: function() {
      return this.getUrl(true);
    },
    getUrl: function(escaped) {
      return _.map(this.attributes, __bind(function(value, key) {
        return this.encodeValue(value, escaped);
      }, this)).join('/');
    },
    encodeValue: function(value, escape) {
      if (escape) {
        return encodeURIComponent(value);
      } else {
        return value;
      }
    },
    getRoutePattern: function() {
      return _.map(this.attributes, __bind(function(value, key) {
        return (key === 'eventLogo' ? '*' : ':') + key;
      }, this)).join('/');
    },
    update: function(args) {
      var i, keys, newValues, values, _ref;
      if (!args) {
        return;
      }
      values = _.values(args);
      keys = _.keys(this.attributes);
      if (values.length !== keys.length) {
        return;
      }
      newValues = {};
      for (i = 0, _ref = values.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        newValues[keys[i]] = values[i];
      }
      return this.set(newValues);
    },
    set: function(attributes, options) {
      _.each(attributes, __bind(function(value, key) {
        return attributes[key] = this.cleanupValue(key, value);
      }, this));
      return Backbone.Model.prototype.set.call(this, attributes, options);
    },
    cleanupValue: function(key, value) {
      if (_.isBoolean(this.get(key))) {
        return value === 'true';
      }
      return value;
    }
  });
}).call(this);
