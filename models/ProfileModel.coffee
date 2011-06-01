NameTag.ProfileModel = Backbone.Model.extend
  initialize: (options) ->
    _.bindAll this, 'fetch', 'clear', 'gotProfiles', 'isEmpty'
      
  fetch: (options) ->
    IN.API
      .Profile('me')
      .fields('id', 'firstName', 'lastName', 'headline', 'location', 'positions', 'educations', 'pictureUrl', 'publicProfileUrl')
      .result (profiles) =>
        @gotProfiles(profiles)
  
  clear: (options) ->
    IN.User.logout()
    Backbone.Model.prototype.clear.call this, options
  
  gotProfiles: (profiles) ->
    @set profiles.values[0]
  
  isEmpty: ->
    _.size(@attributes) == 0