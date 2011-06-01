NameTag.EventModel = Backbone.Model.extend
  initialize: (options) ->
    _.bindAll this, 'url', 'getUrl', 'encodeValue', 'getRoutePattern', 'update', 'set', 'cleanupValue'
      
  defaults: 
    eventName:              'LinkedIn Talent Connect 2011'
    namePositionTop:        false 
    extended:               false
    style:                  'gray'
    eventLogo:              "http://#{window.location.host}/img/logo.png"
  
  url: ->
    @getUrl true
  
  getUrl: (escaped) ->
    _.map(@attributes, (value, key) => @encodeValue(value, escaped)).join('/')
  
  encodeValue: (value, escape) ->
    if escape then encodeURIComponent(value) else value
  
  getRoutePattern: ->
    _.map(@attributes, (value, key) => (if key == 'eventLogo' then '*' else ':') + key).join('/')
  
  update: (args) ->
    return if !args

    values = _.values args
    keys = _.keys @attributes
    
    return if values.length != keys.length
    
    newValues = {}
    newValues[keys[i]] = values[i] for i in [0...values.length]

    @set newValues
  
  set: (attributes, options) ->
    _.each attributes, (value, key) =>
      attributes[key] = @cleanupValue key, value

    Backbone.Model.prototype.set.call this, attributes, options
  
  cleanupValue: (key, value) ->
    return value == 'true' if _.isBoolean @get(key)
    return value
